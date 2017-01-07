const nodeAsync = require('async')
const request = require('request')

var fs = require('fs')
var json2csv = require('json2csv')

// ladder
// leagues to consider
const leagues = ["Breach", "Hardcore Breach"]

// passive fetches = |leagues| * total
var [total, async_limit, limit] = process.argv.slice(2);
// boundaries set by ggg api
total = Math.min(15000, Math.max(1, total || 0))
limit = Math.min(200, Math.max(1, limit || 200))
// number of simultanous async calls to ggg servers
async_limit = Math.min(Number.POSITIVE_INFINITY, Math.max(1, async_limit || 500))

// cut of remainder
total -= total % limit

const start = Date.now()

const log_filename = __dirname + `/out/get_trees_log` // ${start}_
const out_filename = __dirname + `/out/get_trees.csv` // ${start}_

/**
 * generates the url for the ggg ladder api
 * see https://www.pathofexile.com/developer/docs/api-resource-ladders
 *
 * @param league
 * @param offset
 * @param limit
 * @returns {string}
 */
const ladderApi = function (league, offset, limit) {
    return `http://api.pathofexile.com/ladders/${league}?offset=${offset}&limit=${limit}&track=true`
}


/**
 * partial inverse to ladderApi
 * @param api_url
 * @returns {string}
 */
const ladderApiToLeague = function (api_url) {
    return decodeURIComponent(api_url.match(/http:\/\/api.pathofexile.com\/ladders\/([^?]+)\?.*/)[1])
}

/**
 * generates the url to display all used passives
 *
 * @param character
 * @param account
 * @returns {string}
 */
const passivesApi = function (character, account) {
    return `https://www.pathofexile.com/character-window/get-passive-skills?character=${character}&accountName=${account}`
}

// list of lines that should be included in the report_log
var report_log = []

const runtime = (function () {
    report_log.push("started task at " + start)

    return function () {
        return Date.now() - start
    }
})()

report_log.push(`fetching total of ${total} in chunks of ${limit}`)

// apparently there can exist name collisions with accounts
// so the get-passive-skills prob only returns the current character
// while the ladders api may return deleted chars
// this means that we will assign new passives to deleted chars if another one was created
// character id => ladder entry
var entries = new Map()

// passives_url => character id
var passives_urls_characters = new Map()

// w/o array.fill it results in empty values
// create the ladder urls for each league and flatten it into one array
const ladder_urls
    = [].concat(...leagues.map(league =>
        new Array(total / limit).fill(0).map((_, offset) => ladderApi(league, offset * limit, limit))))

report_log.push(`fetching total of ${ladder_urls.length} ladders over ${leagues.length} leagues`)

var ladderComplete = function (results) {
    report_log.push(`finished ladder fetch after ${runtime()}ms`)

    // flattened passive urls
    var passives_urls = [].concat(...results.map(l => {
        // parse the body and map on every entry its passives url
        var body = JSON.parse(l.body)

        var league = ladderApiToLeague(l.request.href)

        if (l.statusCode == 404 || !body.entries) {
            console.warn("no entries", l.request.href)
            return false
        }

        return body.entries.map(e => {
            var passive_url = passivesApi(e.character.name, e.account.name)

            // save the entry
            entries.set(e.character.id, Object.assign(e, {league: league}))
            // and a reverse mapping so we can get the entry via url
            passives_urls_characters.set(passive_url, e.character.id)

            return passive_url
        })
    })).filter(u => u)

    //console.log(passives_urls)

    report_log.push(`fetching ${passives_urls.length} passives`)

    nodeAsync.mapLimit(passives_urls, async_limit, request, (e, results) => {
        if (e) throw e
        passivesComplete(results)
    })
}

var passivesComplete = function (results) {
    report_log.push(`finished passive fetch after ${runtime()}ms (${runtime() / results.length}ms/passive)`)

    var trees = []

    for (var result of results) {
        var passives = JSON.parse(result.body)

        if (passives) {
            var nodes = passives.hashes

            var passive_url = result.request.href

            var entry = entries.get(passives_urls_characters.get(passive_url))

            //console.log(passive_url, entry)

            trees.push({
                entry: entry,
                nodes: nodes
            })
        } else {
            // FIXME first breach result returns false but browser is ok
            report_log.push(result.request.href)
        }
    }

    taskComplete(trees)
}

var taskComplete = function (trees) {
    const fields = [
        "entry.account.name",
        "entry.character.name",
        "entry.league",
        "entry.character.level",
        "entry.character.class",
        "entry.dead",
        "nodes",
        "entry.account.challenges.total",
    ]

    const csv = json2csv({data: trees, fields: fields})

    fs.writeFile(out_filename, csv, function(err) {
        if (err) throw err;
        console.log('csv saved');
    });

    fs.writeFile(log_filename, report_log.join("\n"), function(err) {
        if (err) throw err;
        console.log('log saved');
    });
}

nodeAsync.mapLimit(ladder_urls, async_limit, request, (e, results) => {
    if (e) {
        throw(e)
    }

    ladderComplete(results)
})