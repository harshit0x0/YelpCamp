const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const methodOverride = require('method-override');
const { validateReview, isLoggedin, isReviewAuthor } = require('../utils/middlewares');
const reviews = require('../controllers/reviews');

router.use(methodOverride('_method'));

router.post('/', isLoggedin, validateReview, catchAsync(reviews.addReview));

router.delete("/:reviewId", isLoggedin, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;