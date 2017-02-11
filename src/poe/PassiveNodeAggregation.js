const PassiveTreeUrl = require('./PassiveTreeUrl');

const NODES_KEY = 'nodes';

module.exports = class NodeAggregation {
  /**
   * @constructor
   * @param {Object[]} rows list of objects with a nodes key
   */
  constructor(rows) {
    this.rows = rows;
  }

  /**
   * increments the value for the given key or creates it
   *
   * @param {Map} map
   * @param {any} key
   */
  static incMapKey(map, key) {
    if (map.has(key)) {
      map.set(key, map.get(key) + 1);
    } else {
      map.set(key, 1);
    }
  }

  /**
   * @return {string} the key which is access to get the list of nodes
   */
  static get nodes_key() {
    return NODES_KEY;
  }

  /**
   * filters each row by the given fn
   *
   * @param {function} fn rows.filter wrapper
   * @return {NodeAggregation}
   */
  filter(fn) {
    return new NodeAggregation(this.rows.filter(fn));
  }

  /**
   * sums up the occurrence of nodes in its rows
   *
   * @param {function} blacklist_fn
   * @return {Map}
   */
  sum(blacklist_fn) {
    if (!blacklist_fn) {
      // blacklist none per default
      blacklist_fn = () => false;
    }

    let aggregated = new Map();

    for (let row of this.rows) {
      let nodes = [];

      try {
        nodes = PassiveTreeUrl.decode(row[NODES_KEY]).nodes;
      } catch (e) {
        console.warn(e);
      }

      for (const node_id of nodes) {
        if (!blacklist_fn(node_id)) {
          NodeAggregation.incMapKey(aggregated, node_id);
        }
      }
    }

    return aggregated;
  }

  /**
   * calculates the gradient between 2 maps
   * if a key is not set in one of the maps 0 is assumed
   *
   * @param {Map} map1
   * @param {Map} map2
   * @return {Map}
   */
  static grad(map1, map2) {
    let gradient = new Map();

    for (let key of new Set(...aggregated1.keys(), ...aggregated2.keys())) {
      const val1 = aggregated1.get(key) || 0;
      const val2 = aggregated2.get(key) || 0;

      gradient.set(key, val1 - val2);
    }

    return gradient;
  }
};
