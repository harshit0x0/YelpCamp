const express = require("express")
const app = express();
const path = require("path")
const mongoose = require("mongoose")
const Campground = require("./models/campground");
const Review = require("./models/review");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressErrors');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const campgroundRoutes = require('./routes/campground.js')
const reviewRoutes = require('./routes/reviews.js')
const userRoutes = require('./routes/users.js');
const session = require('express-session')
const flash = require('connect-flash')
const User = require('./models/user')
const passport = require('passport');
const LocalStratergy = require('passport-local')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("database connected");
})

app.set("views", path.join(__dirname, '/views'));
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.get('/', (req, res) => {
    res.render("home.ejs");
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render('error.ejs', { err });
})

app.listen(3000, () => {
    console.log("serving on port 3000");
})