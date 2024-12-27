const express = require("express");
const route = express.Router({ mergeParams: true });
const { listing_schema, review_schema } = require("../schema.js");
const reviews = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");

//middlewere
const validate_review = (req, res, next) => {
    console.log(req.body);
    let { error } = review_schema.validate(req.body)
    if (error) {
        throw new ExpressError(400, error)
    }
    else {
        next();
    }
}

//delete review route
route.delete("/:rev_id", wrapAsync(async (req, res) => {
    let { id, rev_id } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { review: rev_id } })
    console.log(rev_id);
    await reviews.findByIdAndDelete(rev_id);
    res.redirect(`/listing/${id}`);
}))


//add a new review route
route.post("/", validate_review, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let reviewlisting = await listing.findById(id);
    let newreview = new reviews(req.body.review)
    reviewlisting.review.push(newreview);
    await newreview.save();
    await reviewlisting.save();
    res.redirect(`/listing/${id}`);
}));


module.exports = route;