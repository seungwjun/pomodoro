import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import store, { storeIntoLocalStorage } from './store';
import { updateCurrentTask, openNewTaskForm } from './actions';
import TaskTable from './TaskTable';
import { is, fromJS } from 'immutable';
import pomodoroPng from './pomodoro-done.png';
import NewTaskModal from './NewTaskModal';

// XXX For testing
window.store = store;
window.fromJS = fromJS;

class App extends Component {
  componentDidMount() {
    setInterval(function() {
      store.dispatch(updateCurrentTask());
    }, 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const taskHistoryChanged = !is(this.props.taskHistory, nextProps.taskHistory);
    const formChanged = !is(this.props.newTaskForm, nextProps.newTaskForm);
    if (taskHistoryChanged) {
      storeIntoLocalStorage();
      updateTitle(nextProps.taskHistory);
    }
    return taskHistoryChanged || formChanged;
  }

  render() {
    console.log('App.render()');
    return (
      <Grid centered padded columns={1}>
        <NewTaskModal {...this.props.newTaskForm.toJS()} />
        <Grid.Column>
          <div className='column'><TaskTable openForm={openForm} history={this.props.taskHistory} /></div>
        </Grid.Column>
      </Grid>
    );
  }
}

function openForm() {
  store.dispatch(openNewTaskForm());
}

function updateTitle(taskHistory) {
  const topTask = taskHistory.get(0);
  if (!topTask) return;
  const remainingMinutes = topTask.get('remainingMinutes');
  document.title = remainingMinutes + ' - Pomodoro';
  if (remainingMinutes === 0) {
    new Notification(topTask.get('taskName'), {
      body: topTask.get('durationMinutes') + ' minutes have passed',
      icon: pomodoroPng
    });
  }
}

Notification.requestPermission();

export default App;
