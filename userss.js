const express = require('express');
const router = express.Router();

const users = [];

router.get('/', (req, res) => {
  res.status(200).json(users);
});

router.post('/', (req, res) => {
  const data = req.body;
  const user = {
    id: users.length,
    name: data.name,
    gender: data.gender,
    age: data.age
  }
  users.push(user);
  res.status(201).json({ message: 'User created successfully', user });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  if (id >= users.length) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const user = req.body;
  users[id] = user;
  res.status(200).json({ message: 'User updated successfully', user });
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if (id >= users.length) {
    res.status(404).json({ message: 'User not found' });
  }
  users.splice(id, 1);
  res.status(200).json({ message: 'User deleted successfully' });
})