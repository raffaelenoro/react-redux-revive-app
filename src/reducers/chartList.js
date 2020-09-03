import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case HOME_PAGE_LOADED:
      return {
        ...state,
        pager: action.pager,
        charts: action.payload[0].charts,
        chartsCount: action.payload[0].chartsCount,
        currentPage: 0,
        tab: action.tab
      };
    case HOME_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};