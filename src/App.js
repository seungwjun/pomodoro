import React, { Component } from 'react';
import { Grid, Table, Button, Modal, Form, Icon } from 'semantic-ui-react';
import store, { storeIntoLocalStorage } from './store';
import { startTask, updateCurrentTask } from './actions';
import { is, fromJS } from 'immutable';
import formatDate from 'dateformat';
import pomodoroPng from './pomodoro-done.png';

// XXX For testing
window.startTask = function(taskName, durationMinutes) {
  store.dispatch(startTask(taskName, durationMinutes));
}
window.store = store;
window.fromJS = fromJS;

const TaskRow = (props) => {
  const task = props.task;
  return (
    <Table.Row>
      <Table.Cell>{task.get('taskName')}</Table.Cell>
      <Table.Cell>{formatDate(task.get('startTime'), 'yyyy-mm-dd HH:MM')}</Table.Cell>
      <Table.Cell>{formatDuration()}</Table.Cell>
    </Table.Row>
  );

  function formatDuration() {
    return task.get('remainingMinutes') + ' / ' + task.get('durationMinutes') + ' minutes';
  }
}

const TaskTable = (props) => {
  return (
    <Table color='teal'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Task&nbsp;&nbsp;<NewTaskModal/></Table.HeaderCell>
          <Table.HeaderCell style={{width: '160px'}}>Started</Table.HeaderCell>
          <Table.HeaderCell style={{width: '160px'}}>Duration</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {props.history.map(task => <TaskRow key={task.get('id')} task={task}/>)}
      </Table.Body>
    </Table>
  );
}

class NewTaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    }
  }

  render() {
    return (
      <Modal trigger={<Icon name='edit' onClick={this.toggleModalOpen.bind(this)} color='teal' style={{cursor: 'pointer'}}/>}
             open={this.state.modalOpen}>
        <Modal.Content>
          <Form onSubmit={this.submitTask.bind(this)} onKeyDown={this.processKeyDown.bind(this)}>
            <Form.Field>
              <label>Task</label>
              <input autoFocus ref={(self) => this.taskNameInput = self} />
            </Form.Field>
            <Form.Field>
              <label>Duration in minutes</label>
              <input defaultValue='25' ref={(self) => this.durationMinutesInput = self} />
            </Form.Field>
            <Button type='submit'>Start</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }

  processKeyDown(ev) {
    if (ev.keyCode === 27 /* ESC */) {
      this.setState({
        modalOpen: false
      })
    }
  }

  toggleModalOpen() {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  submitTask(ev) {
    store.dispatch(startTask(this.taskNameInput.value, +this.durationMinutesInput.value));
    this.setState({
      modalOpen: false
    });
    ev.preventDefault();
  }
}

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
