if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongooes = require("mongoose");
const path = require("path");
const methode = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passport_local = require("passport-local");
const user = require("./models/user.js");

const listen_route = require("./router/listing_route.js");
const review_route = require("./router/review_route.js");
const user_route = require("./router/user_route.js");
//connectig to DB

main()
    .then(res => console.log("sucessful"))
    .catch(err => console.log(err));

async function main() {
    await mongooes.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// express uses
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methode("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const session_option = {
    secret: "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(session_option));
app.use(flash());


//authentication user after the session is establish
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passport_local(user.authenticate()));

passport.serializeUser(user.serializeUser());//store the user login credentials in a session 
passport.deserializeUser(user.deserializeUser());//removes the user credentials from the session once closed


app.use((req, res, next) => {
    res.locals.flash = req.session.flash || {};
    delete req.session.flash; // Clear flash messages after they're displayed
    res.locals.user = req.user;
    next();
});


app.use((req, res, next) => {
    req.flash = (type, message) => {
        if (!req.session.flash) req.session.flash = {};
        req.session.flash[type] = message;
    };
    next();
});

//listning port=> 8080
app.listen(8080);

// RUST APIs 


//index listing route
app.use("/listing", listen_route);

//review route
app.use("/listing/:id/reviews", review_route);

//user auoth/authenication route
app.use("/user", user_route);


//default route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})

//error handlor
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status).render("error.ejs", { errs: err });
})


