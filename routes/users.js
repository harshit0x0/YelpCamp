const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../utils/middlewares');
router.get('/register', (req, res) => {
    res.render('users/register.ejs');
})
router.get('/login', (req, res) => {
    res.render('users/login.ejs');
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.post('/login',
    storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', }),
    (req, res) => {
        req.flash('success', "Welcome back!");
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        res.redirect(redirectUrl);
    });

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            console.log(err.message);
            next(err);
        }
        req.flash('success', 'Logged out');
        res.redirect('/campgrounds');
    })
})

module.exports = router;