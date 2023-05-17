const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tasks = [];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title, responsible, startDate, endDate, priority, description } = req.body;
  const newTask = {
    id: tasks.length + 1,
    title,
    responsible,
    startDate,
    endDate,
    priority,
    description,
    completed: false,
  };
  tasks.push(newTask);
  res.json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== parseInt(id));
  res.json({ message: 'Task deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});