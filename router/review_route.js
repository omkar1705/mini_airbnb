const express = require("express");
const route = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validate_review, isLogIn, isOwner_review } = require("../middlewere.js");
const reviewcontroller = require("../controllers/review.js");

//middlewere

//delete review route
route.delete("/:rev_id", isOwner_review, wrapAsync(reviewcontroller.delete_review))


//add a new review route
route.post("/", isLogIn, validate_review, wrapAsync(reviewcontroller.new_review_post));


module.exports = route;