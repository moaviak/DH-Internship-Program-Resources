let tasks = [];
let taskIdCounter = 1;

function getAllTasks() {
  return tasks;
}

function addTask(task) {
  task.id = taskIdCounter++;
  tasks.push(task);
  return task;
}

function updateTask(id, updatedTask) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedTask };
    return tasks[index];
  }
  return null;
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    return tasks.splice(index, 1)[0];
  }
  return null;
}

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
};
