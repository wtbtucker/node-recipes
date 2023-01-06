const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/login', userController.user_login_get);
router.post('/login', userController.user_login_post);
router.get('/logout', userController.user_logout);
router.get('/register', userController.user_register_get);
router.post('/register', userController.user_register_post);

module.exports = router;