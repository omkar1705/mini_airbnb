const express = require("express");
const route = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const user = require("../models/user.js");
const passport = require("passport");
const passport_local = require("passport-local");




route.get("/signup_login", (req, res) => {
    res.render("signin_up");
})

route.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, user_pass } = req.body;
        console.log(username, email, user_pass);
        const new_user = new user({
            username,
            email,
        })
        console.log(await user.register(new_user, user_pass));
        req.flash("success", "you have registered successfully :) ");
        res.redirect("/listing");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/user/signup_login");
    }

}))


route.post("/login", passport.authenticate("local", { failureRedirect: "/user/signup_login", failureFlash: true }), wrapAsync(async (req, res) => {
    req.flash("success", "wellcome to wanderlust !!");
    res.redirect("/listing");
}))



module.exports = route;