import React, { Component } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';
import store from './store';
import { submitNewTaskAndCloseForm, closeNewTaskForm } from './actions';

class NewTaskModal extends Component {
  render() {
    return (
      <Modal open={this.props.shouldOpen}>
        <Modal.Content>
          <Form onSubmit={this.submitTask.bind(this)} onKeyDown={this.processKeyDown.bind(this)}>
            <Form.Field>
              <label>Task</label>
              <input autoFocus defaultValue={this.props.defaultTaskName} ref={(self) => this.taskNameInput = self} />
            </Form.Field>
            <Form.Field>
              <label>Duration in minutes</label>
              <input defaultValue={this.props.defaultDurationMinutes} ref={(self) => this.durationMinutesInput = self} />
            </Form.Field>
            <Button type='submit'>Start</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }

  processKeyDown(ev) {
    if (ev.keyCode === 27 /* ESC */) {
      store.dispatch(closeNewTaskForm());
    }
  }

  submitTask(ev) {
    store.dispatch(submitNewTaskAndCloseForm(this.taskNameInput.value, +this.durationMinutesInput.value));
    ev.preventDefault();
  }
}

export default NewTaskModal;