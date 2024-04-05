const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register.ejs');
}
module.exports.renderLoginForm = ((req, res) => {
    res.render('users/login.ejs');
})
module.exports.createNewUser = async (req, res, next) => {
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
}
module.exports.loginUser = (req, res) => {
    req.flash('success', "Welcome back!");
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            console.log(err.message);
            next(err);
        }
        req.flash('success', 'Logged out');
        res.redirect('/campgrounds');
    })
}