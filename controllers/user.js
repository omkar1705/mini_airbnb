const ExpressError = require("../utils/ExpressError.js");
const user = require("../models/user.js");
const { saveredirecturl } = require("../middlewere.js");


module.exports.sign_up_in = (req, res) => {
    res.render("signin_up");
}



module.exports.signup_to_db_post = async (req, res) => {
    try {
        let { username, email, user_pass } = req.body;
        console.log(username, email, user_pass);
        const new_user = new user({
            username,
            email,
        })
        const register_user = await user.register(new_user, user_pass);
        req.login(register_user, (err) => {
            if (err) {
                next(err);
            };
            req.flash("success", "you have registered successfully :) ");
            res.redirect("/listing");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/user/signup_login");
    }

}



module.exports.login_auth = async (req, res) => {
    req.flash("success", "wellcome to wanderlust !!");
    if (!res.locals.redirecturl) {
        res.redirect("/listing");
    }
    res.redirect(res.locals.redirecturl);
}
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "u have been logout");
        res.redirect("/listing");
    })
}
