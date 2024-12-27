const express = require("express");
const app = express();
const mongooes = require("mongoose");
const path = require("path");
const methode = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listen_route = require("./router/listing_route.js");
const review_route = require("./router/review_route.js");
const session = require("express-session");
const flash = require("connect-flash");

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

app.use((req, res, next) => {
    res.locals.flash = req.session.flash || {};
    delete req.session.flash; // Clear flash messages after they're displayed
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
app.get("/", (req, res) => {
    res.send("hi");
})

//index listing route
app.use("/listing", listen_route);

//review route
app.use("/listing/:id/reviews", review_route);

//default route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})


//error handlor
app.use((err, req, res, next) => {
    console.log(err);
    // let {status =500,message = "something whent wrong"} = err;
    res.status(err.status).render("error.ejs", { errs: err });
})

