const mongoose = require("mongoose")
const Review = require("./review")
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
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