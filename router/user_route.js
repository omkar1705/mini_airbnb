const express = require("express");
const route = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveredirecturl } = require("../middlewere.js");
const usercontroller = require("../controllers/user.js");


//user signup of login page route
route.get("/signup_login", usercontroller.sign_up_in)

//user signup page to db store route
route.post("/signup", wrapAsync(usercontroller.signup_to_db_post))


//user login page to authenticate route
route.post("/login", saveredirecturl, passport.authenticate("local", {
    failureRedirect: "/user/signup_login",
    failureFlash: true
}), wrapAsync(usercontroller.login_auth))

//userlogout route
route.get("/logout", usercontroller.logout)




module.exports = route;