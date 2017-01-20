const assert = require('assert');
const TreeUrl = require('../../lib/TreeUrl.js');

// working [tree, url] mappings
const fixtures = [
    [{
        version: 4,
        starting_class: 4,
        ascendancy: 3,
        fullscreen: 1,
        nodes: [6,94,476,1203,1568,1698,2094,2913,3469,3533,5152,5237,5408,5622,6108,6542,6580,6712,7374,9171,10031,11088,11412,11651,12937,13714,15064,15073,15365,15405,15868,18302,19069,19939,20010,20551,22627,23471,24377,24383,25111,25209,25933,26196,26866,28475,29353,29856,30380,30679,30691,30693,30733,31080,31700,32117,33435,33631,33740,33940,34009,34171,34678,35185,35568,36047,36704,36949,37501,39023,39483,39725,40927,41472,42583,43374,44429,44908,44967,45227,46578,46910,48438,48807,49178,49254,49412,50197,50306,50422,50862,53118,54142,55485,56355,56589,58271,58831,59718,59928,60472,60508,60803,61198,61306,61308,61471,62021,63048,63139,63282,65034,65108,65167,65210]
    }, 'AAAABAQDAQAGAF4B3ASzBiAGogguC2ENjQ3NFCAUdRUgFfYX3BmOGbQaOBzOI9MnLytQLJQtgzKJNZI62DrhPAU8LT38R35KfU3jTipQR1hjW69fOV8_YhdieWVNZlRo8m87cql0oHasd9d343fleA15aHvUfXWCm4Nfg8yElITZhXuHdolxivCMz49gkFWSfZhvmjubLZ_fogCmV6lurY2vbK-nsKu18rc-vTa-p8AawGbBBMQVxILE9sauz37Tfti93CPdDeOf5c_pRuoY7DjsXO2D7w7veu988B_yRfZI9qP3Mv4K_lT-j_66'
    ],
    [{
        version: 4,
        starting_class: 3,
        ascendancy: 2,
        fullscreen: 1,
        nodes: [885,1031,2292,3452,3676,4432,5591,5935,6237,6250,6764,6949,7388,7444,7503,8948,9432,10153,10490,10771,10893,11430,11455,13753,14040,14182,14211,14936,15365,15599,15711,17790,18002,18715,18865,19374,19595,19635,20077,21075,21958,21974,22088,22115,22473,22535,22647,22757,23083,23659,24157,24324,25831,26196,26270,26866,27203,27386,27514,27659,27929,30767,31875,31973,32710,32932,33435,33755,33864,34157,34171,34478,35958,36634,36678,37078,37114,37163,37671,38805,38900,39483,39841,39986,40366,40927,41263,41970,42436,42731,42760,42795,42900,44184,44529,46897,47251,48778,49236,49254,49605,50029,51391,53279,53757,54657,54694,55247,55332,55643,57197,57226,58103,58402,59650,60398,60440,60472,60501,60732,61259,61308,61320,61419,61804,63425,63447,63799,64210,64588]
    }, 'AAAABAMCAQN1BAcI9A18DlwRUBXXFy8YXRhqGmwbJRzcHRQdTyL0JNgnqSj6KhMqjSymLL81uTbYN2Y3gzpYPAU87z1fRX5GUkkbSbFLrkyLTLNObVJTVcZV1lZIVmNXyVgHWHdY5VorXGteXV8EZOdmVGaeaPJqQ2r6a3psC20ZeC98g3zlf8aApIKbg9uESIVthXuGrox2jxqPRpDWkPqRK5Mnl5WX9Jo7m6GcMp2un9-hL6PypcSm66cIpyunlKyYrfG3MbiTvorAVMBmwcXDbci_0B_R_dWB1abXz9gk2Vvfbd-K4vfkIukC6-7sGOw47FXtPO9L73zviO_r8Wz3wffX-Tf60vxM'
    ],
    [{
        version: 4,
        starting_class: 2,
        ascendancy: 3,
        fullscreen: 1,
        nodes: [367,1031,1822,3452,3656,3676,4011,4219,4399,4432,4502,5237,5408,5591,5823,6038,6363,6538,6580,6949,7938,8948,9171,9355,9373,10808,11018,11455,11497,11651,13753,14021,14156,15711,17421,17790,18033,18769,18865,19374,19635,20010,21075,22088,22115,23471,23659,24050,24426,24643,25178,26096,27386,27659,27929,28012,28221,28265,28455,30030,32640,32710,33545,33864,33989,34009,34478,34483,34666,35706,36704,36858,37671,38190,38662,38805,38900,39530,39861,40631,41263,42178,42637,42795,43412,45035,46092,46408,48698,48768,48778,48807,49408,49978,50029,50338,50360,51101,51440,51923,53279,53456,54142,54776,55247,55332,55643,56090,56589,57240,58103,59252,59370,59650,59800,60090,60259,60440,61306,61320,61419,61653,61805,62795,63139,63795,63799,65296]
    }, 'AAAABAIDAQFvBAcHHg18DkgOXA-rEHsRLxFQEZYUdRUgFdcWvxeWGNsZihm0GyUfAiL0I9MkiySdKjgrCiy_LOktgzW5NsU3TD1fRA1FfkZxSVFJsUuuTLNOKlJTVkhWY1uvXGtd8l9qYENiWmXwavpsC20ZbWxuPW5pbyd1Tn-Af8aDCYRIhMWE2YauhrOHaot6j2CP-pMnlS6XBpeVl_Saapu1nrehL6TCpo2nK6mUr-u0DLVIvjq-gL6KvqfBAMM6w23EosS4x53I8MrT0B_Q0NN-1fjXz9gk2VvbGt0N35ji9-d05-rpAumY6rrrY-wY73rviO_r8NXxbfVL9qP5M_k3_xA='
    ]
];

describe('TreeUrl', function () {
    describe('#decode()', function () {
        it('should decode every fixture correctly', function () {
            assert.deepEqual(
                fixtures.map(m => TreeUrl.decode(m[1]))
                , fixtures.map(m => m[0])
            );
        })
    });

    describe('#encode()', function () {
        it('should encode every fixture correctly', function () {
            assert.deepEqual(
                fixtures.map(m => 
                    TreeUrl.encode(m[0].version
                                    , m[0].starting_class
                                    , m[0].ascendancy
                                    , m[0].nodes
                                    , m[0].fullscreen)
                )
                , fixtures.map(m => m[1])
            );
        })
    })
});