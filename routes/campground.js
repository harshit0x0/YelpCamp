const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const methodOverride = require('method-override');
const { isLoggedin, validateCampground, isAuthor } = require('../utils/middlewares');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { CloudStorage } = require('../cloudinary');
const upload = multer({ storage: CloudStorage });

router.use(methodOverride('_method'));

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedin, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("it worked");
// })

router.get('/new', isLoggedin, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedin, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedin, catchAsync(campgrounds.renderEditForm));

module.exports = router;
