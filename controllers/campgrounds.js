const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new.ejs");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit.ejs", { campground });
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', "Cannot find that campground!");
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show.ejs", { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    if (!campground) {
        req.flash('error', "Cannot find that campground!");
        return res.redirect('/campgrounds');
    }
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...newImages);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    res.redirect(`/campgrounds/${id}`)
}

module.exports.createCampground = async (req, res) => {
    const location = req.body.campground.location;
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${location}&format=json&apiKey=b3a7ec2dbbe7452290afb58a482f3457`);
    const data = await response.json();
    const campground = new Campground(req.body.campground);
    campground.lat = data.results[0].lat;
    campground.lon = data.results[0].lon;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', "Succefully created new campground!");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Succefully deleted the campground!");
    res.redirect(`/campgrounds`)
}