import {
  DETAILED_TABLE_VIEW_LOADED,
  DETAILED_TABLE_VIEW_UNLOADED,
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case DETAILED_TABLE_VIEW_LOADED:
      return {
        ...state,
        pager: action.pager,
        table: action.payload[0],
        currentPage: 0,
        tab: action.tab
      };
    case DETAILED_TABLE_VIEW_UNLOADED:
      return {};
    default:
      return state;
  }
};