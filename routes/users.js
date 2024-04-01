const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')

router.get('/register', (req, res) => {
    res.render('users/register.ejs');
})
router.get('/login', (req, res) => {
    res.render('users/login.ejs');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash('success', "welcome to yelpcamp");
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', }), (req, res) => {
    req.flash('success', "Welcome back!");
    res.redirect("/campgrounds");
});


module.exports = router;