const API_URL = "http://localhost:3000";

// Function to fetch all tasks
async function fetchTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  const tasks = await response.json();
  renderTasks(tasks);
}

// Function to render tasks
function renderTasks(tasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.innerHTML = `
            <span>${task.title}</span>
            <div>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
    taskList.appendChild(li);
  });
}

// Function to add a new task
async function addTask(title) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  if (response.ok) {
    fetchTasks();
  }
}

// Function to edit a task
async function editTask(id) {
  const newTitle = prompt("Enter new task title:");
  if (newTitle) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    });
    if (response.ok) {
      fetchTasks();
    }
  }
}

// Function to delete a task
async function deleteTask(id) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    fetchTasks();
  }
}

// Event listener for form submission
document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const taskInput = document.getElementById("taskInput");
  if (taskInput.value.trim()) {
    addTask(taskInput.value.trim());
    taskInput.value = "";
  }
});

// Initial fetch of tasks
fetchTasks();
