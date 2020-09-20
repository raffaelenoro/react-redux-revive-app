import {
  ADD_FILTER,
  CHANGE_FILTER,
  REMOVE_FILTER,
} from '../constants/actionTypes';

export default (state = {filters: []}, action) => {
  const filters = state.filters.map(filter => filter);

  switch (action.type) {
    case ADD_FILTER:
      filters.push(action.payload);
      return {
          ...state,
          filters: filters
      };
    case CHANGE_FILTER:
      filters[action.index] = action.payload;
      return {
          ...state,
          filters: filters
      };
    case REMOVE_FILTER:
      filters.splice(action.payload.index, 1)
      return {
        ...state,
        filters: filters
      };
    default:
      return state;
  }
};