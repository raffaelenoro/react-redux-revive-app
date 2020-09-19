import {
  APP_LOAD,
  START_DATE,
  END_DATE,
} from '../constants/actionTypes';

const now = new Date(Date.now() - 24 * 3600 * 1000);
const week_ago = new Date(now - 7 * 24 * 3600 * 1000);

const defaultState = {
    startDate: null,
    endDate: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
        return {
            ...state,
            startDate: week_ago,
            endDate: now
        }
    case START_DATE:
    case END_DATE:
        return {
            ...state,
            startDate: action.payload.startDate,
            endDate: action.payload.endDate
        }
    default:
      return state;
  }
};