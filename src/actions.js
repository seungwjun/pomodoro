export function startTask(taskName, durationMinutes) {
  const startTime = new Date();
  return {
    type: 'START_TASK',
    task: {
      id: startTime.getTime(),
      taskName,
      startTime,
      durationMinutes,
      remainingMinutes: durationMinutes
    }
  };
}

// Update remainingMillis of the current task
export function updateCurrentTask() {
  return {
    type: 'UPDATE_CURRENT_TASK'
  };
}
