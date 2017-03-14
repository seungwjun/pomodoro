import React from 'react';
import { Table } from 'semantic-ui-react';
import formatDate from 'dateformat';
import NewTaskModal from './NewTaskModal';

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

export default TaskTable;
