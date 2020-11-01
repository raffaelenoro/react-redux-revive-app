import {
  APP_LOAD,
  START_DATE,
  END_DATE,
  SET_DIMENSIONS,
  SET_SELECTED_DIMENSION,
  SET_SORTED_DIMENSION,
  ADD_FILTER,
  CHANGE_FILTER,
  REMOVE_FILTER,
  REDIRECT,
  LOGOUT,
  ARTICLE_SUBMITTED,
  SETTINGS_SAVED,
  LOGIN,
  REGISTER,
  EDITOR_PAGE_UNLOADED,
  HOME_PAGE_UNLOADED,
  PROFILE_PAGE_UNLOADED,
  PROFILE_FAVORITES_PAGE_UNLOADED,
  SETTINGS_PAGE_UNLOADED,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED
} from '../constants/actionTypes';

const defaultState = {
  appName: 'Revive',
  token: null,
  viewChangeCounter: 0,
  filters: []
};

const now = new Date(Date.now() - 24 * 3600 * 1000);
const week_ago = new Date(now - 6 * 24 * 3600 * 1000);

export default (state = defaultState, action) => {
  const filters = state.filters.map(filter => filter);

  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.user,
        startDate: action.common ? new Date(action.common.startDate) : week_ago,
        dimensions: action.common ? action.common.dimensions : [],
        selectedDimension: action.selectedDimension,
        sortedDimension: action.sortedDimension,
        filters: action.common ? action.common.filters : filters,
        endDate: action.common ? new Date(action.common.endDate) : now
      };
    case START_DATE:
    case END_DATE:
      return {
        ...state,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate
      };
    case SET_DIMENSIONS:
      return {
          ...state,
          dimensions: action.dimensions
      };
    case SET_SELECTED_DIMENSION:
      return {
          ...state,
          selectedDimension: action.dimension
      };
    case SET_SORTED_DIMENSION:
      return {
          ...state,
          sortedDimension: action.dimension
      };
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
    case REDIRECT:
      return { ...state, redirectTo: null };
    case LOGOUT:
      return {
          ...state,
          redirectTo: '/',
          token: null,
          currentUser: null,
          filters: [],
          startDate: week_ago,
          endDate: now,
      };
    case ARTICLE_SUBMITTED:
      const redirectUrl = `/article/${action.payload.article.slug}`;
      return { ...state, redirectTo: redirectUrl };
    case SETTINGS_SAVED:
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        currentUser: action.error ? null : action.payload.user
      };
    case LOGIN:
    case REGISTER:
      const payload = action && action.payload;
      const token = action.error ? null : payload && payload.message;
      const user = action.error ? null : payload && { username: "shawn" };
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        token: token,
        currentUser: user
      };
    case EDITOR_PAGE_UNLOADED:
    case HOME_PAGE_UNLOADED:
    case PROFILE_PAGE_UNLOADED:
    case PROFILE_FAVORITES_PAGE_UNLOADED:
    case SETTINGS_PAGE_UNLOADED:
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return { ...state, viewChangeCounter: state.viewChangeCounter + 1 };
    default:
      return state;
  }
};
