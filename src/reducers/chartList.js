import {
  CHARTS_VIEW_LOADED,
  CHARTS_VIEW_UNLOADED,
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case CHARTS_VIEW_LOADED:
      return {
        ...state,
        pager: action.pager,
        charts: action.payload[0],
        chartsCount: action.payload[0].length,
        currentPage: 0,
        tab: action.tab
      };
    case CHARTS_VIEW_UNLOADED:
      return {};
    default:
      return state;
  }
};