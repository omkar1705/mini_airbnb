const listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const reviews = require("../models/review.js");
const flash = require("connect-flash");
const mbxGeocodeing = require('@mapbox/mapbox-sdk/services/geocoding');
const { query } = require("express");
const map_token = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocodeing({ accessToken: map_token });

module.exports.home = async (req, res) => {
    res.render("home.ejs", { listings: await listing.find() });
}


module.exports.new_listing_get = (req, res) => {
    res.render("new.ejs");
}

module.exports.show_listing = async (req, res) => {
    let { id } = req.params;
    let detail_listing = await listing.findById(id).populate({ path: "review", populate: { path: "auther" } }).populate("owner");
    if (!detail_listing) {
        req.flash("error", "wrong listing id or listing is deleted");
        res.redirect("/listing");
    }
    console.log(detail_listing);
    res.render("show.ejs", { listing: detail_listing });
}

module.exports.new_listing_post = async (req, res) => {
    let geo_responce = await geocodingClient
        .forwardGeocode({
            query: `${req.body.listing.location},${req.body.listing.country}`,
            limit: 2,
        })
        .send();
    let url = req.file.path;
    let filename = req.file.filename;
    const new_listing = new listing(req.body.listing);
    new_listing.owner = req.user._id;
    new_listing.image = { url, filename };
    new_listing.geometry = geo_responce.body.features[0].geometry;
    console.log(await new_listing.save());
    req.flash("success", "New Listing is added!");
    res.redirect("/listing");
}

module.exports.edit_listing_get = async (req, res) => {
    let { id } = req.params;
    let edit_listing = await listing.findById(id);
    if (!edit_listing) {
        req.flash("error", "listing that u are tyring to acces is not available");
        return res.redirect("/listing");
    }
    let og_image = edit_listing.image.url;
    og_image = og_image.replace("/upload", "/upload/w_250");
    res.render("edit_post.ejs", { listing: edit_listing, url: og_image });
}

module.exports.edit_listing_patch = async (req, res) => {

    let { id } = req.params;
    let listing_ = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing_.image = { url, filename };
        await listing_.save();
    }

    req.flash("success", "Listing is edited");
    res.redirect(`/listing/${id}`);
}

module.exports.delete_listing = async (req, res) => {
    let { id } = req.params;
    let delete_listing = await listing.findByIdAndDelete(id);
    await reviews.deleteMany({ _id: { $in: delete_listing.review } });  // method one second method in /listing.js
    req.flash("success", "listing is deleted");
    res.redirect("/listing");
}
