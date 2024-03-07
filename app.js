const express = require("express")
const app = express();
const path = require("path")
const mongoose = require("mongoose")
const Campground = require("./models/campground");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressErrors');
const { campgroundSchema } = require('./schemas.js');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("database connected");
})

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400)
    }
    else {
        next();
    }
}

app.set("views", path.join(__dirname, '/views'));
app.set("view enjine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

app.get('/', (req, res) => {
    res.render("home.ejs");
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds })
}))

app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/new.ejs");
})

app.get('/campground/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(campground);
    res.render("campgrounds/edit.ejs", { campground });
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show.ejs", { campground });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`)
}))


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