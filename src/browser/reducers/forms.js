import { Map } from 'immutable';
import { SELECT_ANY } from '../actions/rows';

export const initial_filter = Map({
  league: SELECT_ANY,
  klass: SELECT_ANY,
  last_active: '2017-01-01',
  limit: 15000,
  offset: 0,
});

// https://www.patrick-wied.at/static/heatmapjs/docs.html#h337-create
export const initial_heatmap_conf = Map({
  blur: 85,
  min_opacity: 5,
  max_opacity: 55,
  radius: 40,
});

export const initial_tree_conf = Map({
  group_orbits: false,
  start: false,
  scionPathOf: false,
  ascendancy: true,
  mastery: false,
  node_scale: 1.7,
});

/**
 * object for react-redux-form/immutable createForms
 * it returns an empty object if we use immutable types
 * @type {Object}
 */
const forms = {
  data_filter: initial_filter,
  heatmap_conf: initial_heatmap_conf,
  passive_tree_conf: initial_tree_conf,
};

export default forms;
