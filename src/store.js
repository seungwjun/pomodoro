import { createStore, combineReducers } from 'redux';
import { List, Map, fromJS } from 'immutable';

// XXX Should wrap state with Map({ taskHistory: List() })?

const localStorageKey = 'reduxState';
const initialState = loadFromLocalStorage();

function taskHistory(state = List(), action) {
  switch (action.type) {
    case 'START_TASK':
      return state.insert(0, Map(action.task));
    case 'UPDATE_CURRENT_TASK':
      if (state.size === 0) return state;
      return state.update(0, (task) => {
        const remainingMillis = task.get('startTime').getTime() + 60000 * task.get('durationMinutes') - new Date().getTime();
        return task.update('remainingMinutes', (r) => Math.max(0, Math.round(remainingMillis / 60000)));
      });
    default:
      return state;
  }
}

const reducer = combineReducers({
  taskHistory
});

const store = createStore(reducer, initialState);

export function storeIntoLocalStorage() {
  localStorage.setItem(localStorageKey, JSON.stringify(store.getState()));
}

function loadFromLocalStorage() {
  const stateStr = localStorage.getItem(localStorageKey);
  if (stateStr == null) return { taskHistory: List() };
  const state = JSON.parse(stateStr);
  state.taskHistory = state.taskHistory.map(t => {
    t.startTime = new Date(t.startTime);
    return t;
  });
  return { taskHistory: fromJS(state.taskHistory) };
}

export default store;
