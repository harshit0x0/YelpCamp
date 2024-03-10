const { number, string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    ratings: Number,
    body: String
})

module.exports = mongoose.model('Review', reviewSchema);