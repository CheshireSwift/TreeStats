import Immutable, { List, Map } from 'immutable';

import {
  CALCULATE_HEATMAP_DATA,
  EXTREMA_CHANGE,
} from '../actions/heatmap';

const initial = Map({
  data: List(),
  max: 0,
  hash: null,
  instance: null,
  legend: Map({
    min: 0,
    max: 0,
    gradient: Map(),
  }),
});

const heatmap = (state = initial, action) => {
  switch (action.type) {
    case CALCULATE_HEATMAP_DATA:
      return state.withMutations((state) => {
        state.set('max', action.payload.max);
        state.set('data', List(action.payload.data));
        state.set('hash', action.payload.hash);
      });
    case EXTREMA_CHANGE:
      return state.set('legend', Immutable.fromJS(action.payload.legend));
    default:
      return state;
  }
};

export default heatmap;
