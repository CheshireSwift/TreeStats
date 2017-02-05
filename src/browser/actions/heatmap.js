const NodeAggregation = require('../../poe/PassiveNodeAggregation');
import PassiveTreeconf from '../../poe/PassiveTreeConf';
import JavaHashSink from '../../hash_sinks/JavaHashSink';

export const CALCULATE_HEATMAP_DATA = 'CALCULATE_HEATMAP_DATA';
export const EXTREMA_CHANGE = 'EXTREMA_CHANGE';
export const SET_INSTANCE = 'SET_INSTANCE';

/**
 * calculates the heatmap from the current state
 * @param {Object} state redux state
 * @return {Object}
 */
export function calculateHeatmap(state) {
  // rows for actual aggregation
  // passive tree for position info
  // tree conf to check if an aggregated value is visible
  const {rows, passive_tree_conf, passive_tree} = state;

  const conf = new PassiveTreeconf(passive_tree, passive_tree_conf);

  const node_filter = (node_id) => {
    const node = passive_tree.nodes.get(node_id);
    // blacklist if not visible
    return !conf.isVisibleNode(node);
  };

  const aggregate = new NodeAggregation(rows.rows);
  const summarized = aggregate.sum(node_filter);

  // candidate for max value but differences
  // are not recognizeable anymore
  // const passives_taken
  // = Array.from(summarized.values()).reduce((s, v) => s + v, 0);

  // calculate the max
  const max = Math.max(...summarized.values()); // most taken

  // relative to trees which doesnt actually change the image,
  // just doesnt look as dramatic
  // const max = rows.length;

  // hash of the generated values
  const hash_sink = new JavaHashSink();

  // create the data for the heatmaps.js api
  const data = [...summarized].map((entry) => {
    const [node_id, sum] = entry;

    const node = passive_tree.nodes.get(+node_id);

    const datum = {
      x: node.x,
      y: node.y,
      value: sum,
    };

    hash_sink.put(...Object.values(datum));

    return datum;
  });

  return {
    type: CALCULATE_HEATMAP_DATA,
    payload: {
      heatmap_data: {data, max, hash: hash_sink.hash},
    },
  };
};

/**
 * action creator for extrema change
 *
 * @param {Object} data see
 * https://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create #onExtremaChange
 * @return {Object}
 */
export function extremaChange(data) {
  return {
    type: EXTREMA_CHANGE,
    payload: {
      legend: data,
    },
  };
};

/**
 * shares the current heatmap instance
 * useful for heatmapInstance#getValueAt
 * @param {heatmapInstance} heatmap_instance the instance returned from #create
 * @return {Object} redux action
 */
export function setInstance(heatmap_instance) {
  return {
    type: SET_INSTANCE,
    payload: {
      instance: heatmap_instance,
    },
  };
};
