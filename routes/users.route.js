const express = require('express');
const router = express.Router();
const userController = require('../controller/users.controller');
const {authenticate, authAdmin} = require('../middleware/auth');

router.post('/register', userController.registerLogin);
router.post('/login', userController.userLogin);
router.get('/users',authenticate,  authAdmin, userController.getUsers);

router.get('/profile', authenticate, async (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
});

module.exports = router;