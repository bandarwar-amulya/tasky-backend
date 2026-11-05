import express from "express";
import fs from "fs";
const db = "./tasks.json";
const app = express();
app.use(express.json());
app.get("/tasks", (req, res) => {
  const data = fs.readFileSync(db);
  const tasks = JSON.parse(data);
  res.send({
    success: "true",
    tasks: tasks,
  });
});
app.post("/tasks", (req, res) => {
  const title = req.body.title;
  const deadline = req.body.deadline;
  const data = fs.readFileSync(db);
  const tasks = JSON.parse(data);
  const newtask = { id: Date.now(), title, deadline };
  tasks.push(newtask);

  fs.writeFileSync(db, JSON.stringify(tasks, null, 4));
  res.json(newtask);
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const data = fs.readFileSync(db);
  const tasks = JSON.parse(data);

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[index] = {
    ...tasks[index],
    title: req.body.title,
    deadline: req.body.deadline,
  };

  fs.writeFileSync(db, JSON.stringify(tasks, null, 4));

  res.json(tasks[index]);
});
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const data = fs.readFileSync(db);
  let tasks = JSON.parse(data);

  const filteredTasks = tasks.filter((t) => t.id !== id);

  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks = filteredTasks;

  fs.writeFileSync(db, JSON.stringify(tasks, null, 4));

  res.json({ message: "Task deleted successfully" });
});
app.listen(3000, () => {
  console.log("server is running");
});
