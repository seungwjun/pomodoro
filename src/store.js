import { createStore, combineReducers } from 'redux';
import { List, Map, fromJS } from 'immutable';

// XXX Should wrap state with Map({ taskHistory: List() })?

const localStorageKey = 'reduxState';
const initialState = loadFromLocalStorage();

// taskHistory = [
//   { id, taskName, startTime, durationMinutes, remainingMinutes }, ...
// ]
function taskHistory(state = List(), action) {
  switch (action.type) {
    case 'SUBMIT_NEW_TASK_AND_CLOSE_FORM':
      return state.insert(0, Map(action.task));
    case 'UPDATE_CURRENT_TASK':
      if (state.size === 0) return state;
      return state.update(0, (task) => {
        const remainingMillis = task.get('startTime').getTime() + 60000 * task.get('durationMinutes') - new Date().getTime();
        return task.update('remainingMinutes', () => Math.max(0, Math.round(remainingMillis / 60000)));
      });
    default:
      return state;
  }
}

// newTaskForm = {
//   shouldOpen,
//   defaultTaskName,
//   defaultDurationMinutes
// }
function newTaskForm(state = Map(), action) {
  switch (action.type) {
  case 'SUBMIT_NEW_TASK_AND_CLOSE_FORM':
    return state.update('shouldOpen', () => false);
  case 'OPEN_NEW_TASK_FORM':
    const { defaultTaskName, defaultDurationMinutes } = action;
    return Map({
      shouldOpen: true,
      defaultTaskName,
      defaultDurationMinutes
    });
  case 'CLOSE_NEW_TASK_FORM':
    return state.update('shouldOpen', () => false);
  default:
    return state;
  }
}

const reducer = combineReducers({
  taskHistory,
  newTaskForm
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
