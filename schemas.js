const Joi = require('joi')

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
})

module.exports.reviewShcema = Joi.object({
    review: Joi.object({
        ratings: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})