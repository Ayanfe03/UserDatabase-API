const express = require('express');
const router = express.Router();
const { createUserHandler, getUserHandler, updateUserHandler, deleteUserHandler } = require('../../controllers/v1/userController')


router.get('/', getUserHandler);
router.post('/', createUserHandler);
router.put('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);  

module.exports = router;