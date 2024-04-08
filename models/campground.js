const mongoose = require("mongoose")
const Review = require("./review");
const { string } = require("joi");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<extension>
// https://res.cloudinary.com/dt1kuh1tm/image/upload/v1712469714/YelpCamp/ohlvjarjhjgmrkey6gdz.png
const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})
campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: campground.reviews } });
    }
    console.log("deleted all reivews associated");
})

const campground = mongoose.model("campground", campgroundSchema);


module.exports = campground;