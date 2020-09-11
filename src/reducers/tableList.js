import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case HOME_PAGE_LOADED:
      return {
        ...state,
        pager: action.pager[1],
        tables: action.payload[1],
        tablesCount: action.payload[1].length,
        currentPage: 0,
        tab: action.tab
      };
    case HOME_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};