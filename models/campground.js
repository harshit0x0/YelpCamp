const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String
})

const campground = mongoose.model("campground", campgroundSchema);
module.exports = campground;