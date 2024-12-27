const express = require("express");
const route = express.Router();
const listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listing_schema, review_schema } = require("../schema.js");
const reviews = require("../models/review.js");



//middleweres
const validate = (req, res, next) => {
    let { error } = listing_schema.validate(req.body)
    if (error) {
        throw new ExpressError(400, error)
    }
    else {
        next();
    }
}


//all listing route
route.get("/", wrapAsync(async (req, res) => {
    res.render("home.ejs", { listings: await listing.find() });
}))

//create new listing route
route.get("/new", (req, res) => {
    res.render("new.ejs");
})

//show in detain listing route
route.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    res.render("show.ejs", { listing: await listing.findById(id).populate("review") });
}))


//new listing save route
route.post("/", validate, wrapAsync(async (req, res) => {
    const new_listing = new listing(req.body.listing);
    await new_listing.save();
    res.redirect("/listing");
}))


//edit listing form route
route.get("/edit/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let edit_listing = await listing.findById(id);
    res.render("edit_post.ejs", { listing: edit_listing });
}))


//edited listing form route to show in detail route
route.patch("/edit/:id", validate, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
}))


//delete listing route
route.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delete_listing = await listing.findByIdAndDelete(id);
    await reviews.deleteMany({ _id: { $in: delete_listing.review } });  // method one second method in /listing.js
    res.redirect("/listing");
}))


module.exports = route;