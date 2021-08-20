// VARIABLES 
const express = require('express')
const router = express.Router({mergeParams : true});
const {catchAsyncError} = require('../middleware/middleware');
const passport = require('passport');;

// CONTROLLER
const user = require('../controllers/user')

// REGISTER
router.route('/register')
    .get(user.registerForm)
    .post(catchAsyncError(user.registerAction))

// LOGIN
router.route('/login')
    .get(user.loginForm)
    .post(passport.authenticate('local', {failureFlash : true, failureRedirect : '/login'}), user.loginAction)

router.route('/logout')
    .get(user.logout)

module.exports = router; 