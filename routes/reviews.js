const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const methodOverride = require('method-override');
const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview, isLoggedin, isReviewAuthor } = require('../utils/middlewares');

router.use(methodOverride('_method'));

router.post('/', isLoggedin, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    console.log(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review added');
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete("/:reviewId", isLoggedin, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;