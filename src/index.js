import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import { openNewTaskForm } from './actions';

function render() {
  ReactDOM.render(
    <App {...store.getState()} />,
    document.getElementById('root')
  );
}

document.addEventListener('keydown', function(ev) {
  const formOpen = store.getState().newTaskForm.get('shouldOpen');
  if (!formOpen && ev.keyCode === 78 /* n */) {
    store.dispatch(openNewTaskForm());
    ev.preventDefault();
  }
});

render();
store.subscribe(render);
