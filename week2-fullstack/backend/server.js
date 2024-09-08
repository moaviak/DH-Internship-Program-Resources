const http = require("http");
const url = require("url");
const taskController = require("./taskController");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (path === "/tasks") {
    if (method === "GET") {
      // Get all tasks
      const tasks = taskController.getAllTasks();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tasks));
    } else if (method === "POST") {
      // Add a new task
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const newTask = JSON.parse(body);
          const addedTask = taskController.addTask(newTask);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(addedTask));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid task data" }));
        }
      });
    }
  } else if (path.startsWith("/tasks/")) {
    const taskId = parseInt(path.split("/")[2]);

    if (method === "PUT") {
      // Update a task
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const updatedTask = JSON.parse(body);
          const result = taskController.updateTask(taskId, updatedTask);
          if (result) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result));
          } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Task not found" }));
          }
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid task data" }));
        }
      });
    } else if (method === "DELETE") {
      // Delete a task
      const deletedTask = taskController.deleteTask(taskId);
      if (deletedTask) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(deletedTask));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Task not found" }));
      }
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
