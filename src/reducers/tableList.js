import {
  TABLES_VIEW_LOADED,
  TABLES_VIEW_UNLOADED,
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case TABLES_VIEW_LOADED:
      return {
        ...state,
        pager: action.pager,
        tables: action.payload[0],
        tablesCount: action.payload[0].length,
        currentPage: 0,
        tab: action.tab
      };
    case TABLES_VIEW_UNLOADED:
      return {};
    default:
      return state;
  }
};