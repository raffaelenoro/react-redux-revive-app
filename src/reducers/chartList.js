import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case HOME_PAGE_LOADED:
      return {
        ...state,
        pager: action.pager[0],
        charts: action.payload[0],
        chartsCount: action.payload[0].length,
        currentPage: 0,
        tab: action.tab
      };
    case HOME_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};