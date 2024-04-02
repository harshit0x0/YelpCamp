module.exports.storeReturnTo = (req, res, next) => {
    console.log('inside middleware');
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
        // console.log(res.locals.returnTo);
    }
    next();
}

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', "You must be logged in first!")
        return res.redirect('/login');
    }
    next();
}
