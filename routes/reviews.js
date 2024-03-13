const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressErrors');
const { reviewSchema } = require('../schemas.js');
const methodOverride = require('method-override');
const Campground = require("../models/campground");
const Review = require("../models/review");

router.use(methodOverride('_method'));

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400)
    }
    else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    console.log("here");
    console.log(req.body);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    console.log(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review added');
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;