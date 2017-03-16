import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import formatDate from 'dateformat';

const TaskTable = (props) => {
  return (
    <Table color='teal'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Task&nbsp;&nbsp;
            <Icon name='edit' title='New task (n)' onClick={props.openForm} color='teal' style={{cursor:'pointer'}}/>
          </Table.HeaderCell>
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

export default TaskTable;
