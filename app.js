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
const campgrounds = require('./routes/campground.js')
const reviews = require('./routes/reviews.js')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("database connected");
})

app.set("views", path.join(__dirname, '/views'));
app.set("view enjine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


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