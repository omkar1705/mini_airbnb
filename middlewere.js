
const listing = require("./models/listing.js");
const review = require("./models/review.js");
const { listing_schema, review_schema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLogIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirecturl = req.originalUrl;
        req.flash("error", "Plz Login First");
        res.redirect("/user/signup_login");
    }
    next();
};

// to save the path from were the login req is send
// means if we want to add listing and it ask for the login , after login we will redirect to the add listing form not on 
// the home listing page
module.exports.saveredirecturl = (req, res, next) => {
    if (req.session.redirecturl) {
        res.locals.redirecturl = req.session.redirecturl
        delete req.session.redirecturl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing_ = await listing.findById(id);
    if (!(res.locals.user && listing_.owner._id.equals(res.locals.user._id))) {
        req.flash("error", "you are not the owner of the listing");
        return res.redirect("/listing");
    }
    next();
}


//middleweres
module.exports.validate = (req, res, next) => {
    let { error } = listing_schema.validate(req.body)
    if (error) {
        throw new ExpressError(400, error)
    }
    else {
        next();
    }
}


module.exports.validate_review = (req, res, next) => {
    console.log(req.body);
    let { error } = review_schema.validate(req.body)
    if (error) {
        throw new ExpressError(400, error)
    }
    else {
        next();
    }
}



module.exports.isOwner_review = async (req, res, next) => {
    let { id, rev_id } = req.params;
    let review_ = await review.findById(rev_id);
    if (!(res.locals.user && review_.auther._id.equals(res.locals.user._id))) {
        req.flash("error", "you are not the owner of the review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}