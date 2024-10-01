const express = require('express');
const router = express.Router();
const { 
  createUserHandler,
  getUsersHandler, 
  getUserHandler, 
  updateUserHandler, 
  deleteUserHandler, 
  loginUserHandler
} = require('../../controllers/v1/userController');
const { validateToken } = require('../../middleware/auth');


router.get('/', getUsersHandler);
router.post('/', createUserHandler);
router.get('/:id', getUserHandler);
router.put('/:id', validateToken, updateUserHandler);
router.delete('/:id', deleteUserHandler);  
router.post('/login', loginUserHandler);  

module.exports = router;