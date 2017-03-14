import React, { Component } from 'react';
import { Button, Modal, Form, Icon } from 'semantic-ui-react';
import store from './store';
import { startTask } from './actions';

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

export default NewTaskModal;