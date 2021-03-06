import agent from './agent';
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  REGISTER,
  TABLES_VIEW_LOADED,
  DETAILED_TABLE_VIEW_LOADED,
  CHARTS_VIEW_LOADED,
  SET_SELECTED_DIMENSION,
  SET_SORTED_DIMENSION
} from './constants/actionTypes';

const promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

    const currentView = store.getState().viewChangeCounter;
    const skipTracking = action.skipTracking;

    action.payload.then(
      res => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        console.log('RESULT', res);
        action.payload = res;
        store.dispatch({ type: ASYNC_END, promise: action.payload });
        store.dispatch(action);
      },
      error => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        console.log('ERROR', error);
        action.error = true;
        action.payload = error.response.body;
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload });
        }
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

const localStorageMiddleware = store => next => action => {
  if (action.type === REGISTER || action.type === LOGIN) {
    if (!action.error) {
      const token = action.payload && action.payload.message;
      const username = store.getState().auth.email;
      window.localStorage.setItem('jwt', token);
      window.localStorage.setItem('user', JSON.stringify({username: username}));
      agent.setToken(token);
    }
  } else if (action.type === LOGOUT) {
    window.localStorage.setItem('jwt', '');
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('common');
    window.localStorage.removeItem('selectedDimension');
    window.localStorage.removeItem('sortedDimension');
    agent.setToken(null);
  } else if (action.type === TABLES_VIEW_LOADED || action.type === DETAILED_TABLE_VIEW_LOADED || action.type === CHARTS_VIEW_LOADED) {
    const common = store.getState().common;
    window.localStorage.setItem('common', JSON.stringify(common));
  } else if (action.type === SET_SELECTED_DIMENSION) {
    const selectedDimension = action.dimension;
    window.localStorage.setItem('selectedDimension', JSON.stringify(selectedDimension));
  } else if (action.type === SET_SORTED_DIMENSION) {
    const sortedDimension = action.dimension;
    window.localStorage.setItem('sortedDimension', JSON.stringify(sortedDimension));
  }

  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}


export { promiseMiddleware, localStorageMiddleware }
