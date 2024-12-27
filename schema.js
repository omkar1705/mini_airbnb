const joi = require("joi");
const listing = require("./models/listing");
const review = require("./models/review.js");

const listing_schema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.string().allow("", null),
    }).required(),
})



const review_schema = joi.object({
    review: joi.object({
        comment: joi.string().required(),
        rating: joi.number().min(0).max(5).required(),
    }).required(),
})



module.exports = { listing_schema, review_schema }; 