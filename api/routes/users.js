const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const UserController = require('../controllers/users')


// USER SIGN-UP ROUTE
router.post('/signup', UserController.user_signup)

// LOGIN USER ROUTE
router.post('/login', UserController.user_login)

// DELETE USER ROUTE
router.delete('/:userId', checkAuth, UserController.user_delete)


module.exports = router