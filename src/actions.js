// Update remainingMillis of the current task
export function updateCurrentTask() {
  return {
    type: 'UPDATE_CURRENT_TASK'
  };
}

export function openNewTaskForm(defaultTaskName = '', defaultDurationMinutes = 25) {
  return {
    type: 'OPEN_NEW_TASK_FORM',
    defaultTaskName,
    defaultDurationMinutes
  }
}

export function closeNewTaskForm() {
  return {
    type: 'CLOSE_NEW_TASK_FORM'
  }
}

export function submitNewTaskAndCloseForm(taskName, durationMinutes) {
  const startTime = new Date();
  return {
    type: 'SUBMIT_NEW_TASK_AND_CLOSE_FORM',
    task: {
      id: startTime.getTime(),
      taskName,
      startTime,
      durationMinutes,
      remainingMinutes: durationMinutes
    }
  };
}