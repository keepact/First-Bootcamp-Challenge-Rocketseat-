const express = require('express');

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Routes params = /users/1
// Request body = { "name": "Diego", "email": "diego@rocketseat.com.br" }
// CRUD - Create, Read, Update, Delete


const projects = [];

// Middleware Requests Count
let requests = 0;
function requestCount(req, res, next) {
  requests++;

  console.log(`Total de requisições: ${requests}`);

  return next();
}

server.use(requestCount);

// Middleware ID routes

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(item => item.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exist' });
  }

  return next();
}

// GET REQUEST

server.get('/projects', (req, res) => {
  return res.json(projects);
})

// POSTS REQUESTS

server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(item => item.id == id);

  project.tasks.push(title);

  return res.json(project);
});

// PUT REQUEST

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(item => item.id == id);

  project.title = title;

  res.json(project);
});

// DELETE REQUEST

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(item => item.id == id);

  projects.splice(projectIndex, 1);

  return res.json('Projeto Deletado');
});

server.listen(3000, () => {
  console.log('Server started')
})