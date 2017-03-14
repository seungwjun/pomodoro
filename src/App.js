import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import store, { storeIntoLocalStorage } from './store';
import { updateCurrentTask } from './actions';
import TaskTable from './TaskTable';
import { is, fromJS } from 'immutable';
import pomodoroPng from './pomodoro-done.png';

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
    const shouldUpdate = !is(this.props.taskHistory, nextProps.taskHistory);
    if (shouldUpdate) {
      storeIntoLocalStorage();
      updateTitle(nextProps.taskHistory);
    }
    return shouldUpdate;
  }

  render() {
    console.log('App.render()');
    return (
      <Grid centered padded columns={1}>
        <Grid.Column>
          <div className='column'><TaskTable history={this.props.taskHistory} /></div>
        </Grid.Column>
      </Grid>
    );
  }
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
