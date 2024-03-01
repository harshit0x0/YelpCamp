const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
})

const campground = mongoose.model("campground", campgroundSchema);
module.exports = campground;