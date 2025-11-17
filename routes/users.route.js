const express = require('express');
const router = express.Router();
const userController = require('../controller/users.controller');
const {authenticate, authAdmin} = require('../middleware/auth');

router.post('/register', userController.registerLogin); // !register
router.post('/login', userController.userLogin); // !login
router.post('/validate-token', userController.ValidateToken);// !validate token
router.post('/users', authenticate, authAdmin, userController.createUser); // ! create user
router.get('/users',authenticate,  authAdmin, userController.getUsers);//! get users
router.get('/users/:id', authenticate, authAdmin, userController.getUserById); //! get user by id
router.delete('/users/:id', authenticate, authAdmin, userController.deleteUserById);//! delete user by id
router.put('/users/:id', authenticate, authAdmin, userController.updateUserById);//! update user by id
router.get('/profile', authenticate, async (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
});

module.exports = router;