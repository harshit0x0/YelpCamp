const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../utils/middlewares');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.createNewUser))

router.route('/login')
    .get(users.renderLoginForm)
    .post(
        storeReturnTo,
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', }),
        users.loginUser
    )

router.get('/logout', users.logoutUser);

module.exports = router;