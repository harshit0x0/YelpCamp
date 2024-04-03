const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressErrors');
const Campground = require("../models/campground");
const { campgroundSchema } = require('../schemas.js');
const methodOverride = require('method-override');
const { isLoggedin } = require('../utils/middlewares');

router.use(methodOverride('_method'));

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

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds })
}))

router.get('/new', isLoggedin, (req, res) => {
    res.render("campgrounds/new.ejs");
})

router.get('/:id/edit', isLoggedin, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(campground);
    res.render("campgrounds/edit.ejs", { campground });
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', "Cannot find that campground!");
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show.ejs", { campground });
}))

router.put('/:id', isLoggedin, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    if (!campground) {
        req.flash('error', "Cannot find that campground!");
        return res.redirect('/campgrounds');
    }
    res.redirect(`/campgrounds/${id}`)
}))

router.post('/', isLoggedin, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', "Succefully created new campground!");
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:id", isLoggedin, catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Succefully deleted the campground!");
    res.redirect(`/campgrounds`)
}))

module.exports = router;
