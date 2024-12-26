const joi = require("joi");
const listing = require("./models/listing");

const listing_schema = joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country : joi.string().required(),
        image : joi.string().allow("",null),
    }).required(),
})

module.exports = listing_schema;