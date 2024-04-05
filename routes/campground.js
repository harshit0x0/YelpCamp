const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const methodOverride = require('method-override');
const { isLoggedin, validateCampground, isAuthor } = require('../utils/middlewares');
const campgrounds = require('../controllers/campgrounds');

router.use(methodOverride('_method'));

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedin, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedin, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedin, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedin, catchAsync(campgrounds.renderEditForm));

module.exports = router;
