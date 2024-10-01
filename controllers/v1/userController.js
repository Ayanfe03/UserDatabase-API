const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// const users = []; // simulated database, no longer in use, now using real PostgreSQL database

// loads the environmental variables from the .env file
dotenv.config();


// @desc POST Create a new user
// @route POST /v1/users
// @access Public
const createUserHandler = async (req, res) => {
  try {
    let { name, gender, age, email, password } = req.body;
    const lowerCaseGender = gender.toLowerCase();

    if (typeof name !== 'string') {
      res.status(400).json({ message: 'Name must be a string' });
      return;
    }

    if (typeof gender !== 'string') {
      res.status(400).json({ message: 'Gender must be a string' });
      return;
    } else if (lowerCaseGender !== 'male' && lowerCaseGender !== 'female' ) {
      res.status(400).json({ message: 'Gender must be either male or female' });
      return;
    }

    if (typeof email !== 'string') {
      res.status(400).json({ message: 'Email must be a string' });
      return;
    } else if (!email.includes('@')) {
      res.status(400).json({ message: 'Email must be valid' });
      return;  
    }

    if (typeof age !== 'number') {
      res.status(400).json({ message: 'Age must be a number' });
      return;
    } else if (age < 15) {
      res.status(400).json({ message: 'You must be at least 15 years old to register' });
      return;
    }

    if (typeof password !== 'string') {
      res.status(400).json({ message: 'Password must be a string' });
      return;
    } else if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters long' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.build({ name: name, gender: lowerCaseGender, email: email, age: age, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User Created Successfully', user });
    return;
  } catch (error) {
    res.status(500).json({ message: error.message })
  };
};

// @desc GET Retrieves a user
// @route GET /v1/users/:id
// @access Public
const getUsersHandler = async (req, res) => {
  try {
    const users = await User.findAll({});
    res.status(200).json(users);
    return;
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc GET Retrieves a user
// @route GET /v1/users/:id
// @access Public
const getUserHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (typeof id !== 'number' || isNaN(id)) {
      res.status(400).json({ message: 'Id must be a number' });
      return;
    }
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
    return;
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc PUT Updates a user
// @route PUT /v1/users/:id
// @access Public
const updateUserHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    let { name, gender, age, email } = req.body;
    const lowerCaseGender = gender.toLowerCase();

    if (typeof id !== 'number' || isNaN(id)) {
      res.status(400).json({ message: 'Id must be a number' });
      return;
    }

    if (typeof name !== 'string') {
      res.status(400).json({ message: 'Name must be a string' });
      return;
    }

    if (typeof gender !== 'string') {
      res.status(400).json({ message: 'Gender must be a string' });
      return;
    } else if (lowerCaseGender !== 'male' && lowerCaseGender !== 'female' ) {
      res.status(400).json({ message: 'Gender must be either male or female' });
      return;
    }

    if (typeof age !== 'number') {
      res.status(400).json({ message: 'Age must be a number' });
      return;
    } else if (age < 15) {
      res.status(400).json({ message: 'You must be at least 15 years old to register' });
      return;
    } 

    if (typeof email !== 'string') {
      res.status(400).json({ message: 'Email must be a string' });
      return;
    } else if (!email.includes('@')) {
      res.status(400).json({ message: 'Email must be valid' });
      return;  
    }
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.name = name;
    user.gender = gender;
    user.email = email;
    user.age = age;

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
    return;
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// @desc DELETE Deletes a user
// @route DELETE /v1/users/:id
// @access Public
const deleteUserHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (typeof id !== 'number' || isNaN(id)) {
      res.status(400).json({ message: 'Id must be a number' });
      return;
    }

    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc POST Login user
// @route POST /v1/users/login
// @access Public
const loginUserHandler = async (req, res) => {
    const { email, password } = req.body;
    const SECRET_KEY = process.env.JWT_SECRET_KEY

    const user = await User.findOne({ where: { email : email } });

    if (!user) {
      res.status(404).json({ message: 'User does not exist' });
      return; 
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid password' });
      return;
    }
    const payload = {
      id: user.id,
      email: user.email,
    }

    const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

    res.status(200).json({ accessToken, refreshToken });
};

module.exports = {
  createUserHandler,
  getUsersHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
  loginUserHandler
}