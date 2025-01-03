const express = require("express");
const route = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogIn, isOwner, validate } = require("../middlewere.js");
const listingcontroller = require("../controllers/listing.js");
const multer = require("multer");

const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });


route.route("/")
    //all listing route
    .get(wrapAsync(listingcontroller.home))
    //new listing save route
    .post(isLogIn, upload.single('listing[image]'), validate, wrapAsync(listingcontroller.new_listing_post));

//create new listing route
route.get("/new", isLogIn, listingcontroller.new_listing_get)

route.route("/:id")
    //show in detain listing route
    .get(wrapAsync(listingcontroller.show_listing))
    //delete listing route
    .delete(isLogIn, isOwner, wrapAsync(listingcontroller.delete_listing))

route.route("/edit/:id")
    //edit listing form route
    .get(isLogIn, isOwner, wrapAsync(listingcontroller.edit_listing_get))
    //edited listing form route to show in detail route
    .patch(isLogIn, isOwner, upload.single('listing[image]'), validate, wrapAsync(listingcontroller.edit_listing_patch))



module.exports = route;