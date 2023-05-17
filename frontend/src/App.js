import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, deleteTask } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import differenceInDays from 'date-fns/differenceInDays';
import isAfter from 'date-fns/isAfter';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    responsible: '',
    startDate: '',
    endDate: '',
    priority: '',
    description: '',
  });

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    const tasksData = await fetchTasks();
    setTasks(tasksData);
  };

  const handleCreateTask = async () => {
    if (newTask.title.trim() !== '') {
      const taskToSend = {
        title: newTask.title,
        responsible: newTask.responsible,
        startDate: newTask.startDate,
        endDate: newTask.endDate,
        priority: newTask.priority,
        description: newTask.description,
      };

      console.log('JSON enviado:', JSON.stringify(taskToSend));

      const createdTask = await createTask(taskToSend);
      setTasks([...tasks, createdTask]);
      setNewTask({
        title: '',
        responsible: '',
        startDate: '',
        endDate: '',
        priority: '',
        description: '',
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const [showAllTasks, setShowAllTasks] = useState(false);

  const filteredTasks = showAllTasks
    ? tasks
    : tasks.filter((task) => differenceInDays(new Date(), new Date(task.startDate)) <= 7);

  const handleStartDateChange = (e) => {
    const { value } = e.target;
    if (isAfter(new Date(value), new Date(newTask.endDate))) {
      // La fecha de inicio es mayor que la fecha de fin, muestra un mensaje de error o realiza alguna acción
      console.log('La fecha de inicio no puede ser mayor que la fecha de fin');
    } else {
      setNewTask({ ...newTask, startDate: value });
    }
  };

  const handleEndDateChange = (e) => {
    const { value } = e.target;
    if (isAfter(new Date(newTask.startDate), new Date(value))) {
      // La fecha de fin es menor que la fecha de inicio, muestra un mensaje de error o realiza alguna acción
      console.log('La fecha de fin no puede ser menor que la fecha de inicio');
    } else {
      setNewTask({ ...newTask, endDate: value });
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4 text-center">Tareas</h1>
      <div className="mb-3">
        <input
          className="form-control mb-2"
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Enter task title"
          required
        />
        {/* Agrega los campos adicionales a continuación */}
        <input
          className="form-control mb-2"
          type="text"
          value={newTask.responsible}
          onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
          placeholder="Enter responsible"
          required
        />
        <input
          className="form-control mb-2"
          type="date"
          value={newTask.startDate}
          onChange={handleStartDateChange}
          placeholder="Enter start date"
          required
        />
        <input
          className="form-control mb-2"
          type="date"
          value={newTask.endDate}
          onChange={handleEndDateChange}
          placeholder="Enter end date"
          required
        />
        <select
          className="form-select mb-2"
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          required
        >
          <option value="">Select priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <textarea
          className="form-control mb-2"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Enter description"
          required
        ></textarea>
        <button className="btn btn-primary" onClick={handleCreateTask}>
          Add Task
        </button>
      </div>
      <button className="btn btn-primary mb-3" onClick={() => setShowAllTasks(!showAllTasks)}>
        {showAllTasks ? 'Show Recent Tasks' : 'Show All Tasks'}
      </button>
      <div className="row">
        {filteredTasks.map((task) => (
          <div className="col-4" key={task.id}>
            <div className="card mb-3">
              <div className="card-body">
                <h3 className="card-title">{task.title}</h3>
                <p className="card-text">Responsible: {task.responsible}</p>
                <p className="card-text">Start Date: {task.startDate}</p>
                <p className="card-text">End Date: {task.endDate}</p>
                <p className="card-text">Priority: {task.priority}</p>
                <p className="card-text">Description: {task.description}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;