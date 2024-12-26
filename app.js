const express=require("express");
const app = express();
const mongooes = require("mongoose");
const path = require("path");
const listing = require("./models/listing.js");
const methode = require("method-override");
const ejsMate = require("ejs-mate");
const { title } = require("process");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {joi} = require("./schema.js");
const listing_schema = require("./schema.js");


//connectig to DB

main()
.then(res=>console.log("sucessful"))
.catch(err=> console.log(err));

async function main() {
    await mongooes.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// express uses
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methode("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



//listning port=> 8080
app.listen(8080);

// RUST APIs 
app.get("/",(req,res)=>{
    res.send("hi");
})

                                                                                    // app.get("/testlisting",(req,res)=>{
                                                                                    //     let sample = new listing({
                                                                                    //         title : "my home",
                                                                                    //         description : "its a 3 floor bungloo",
                                                                                    //         price : 10000,
                                                                                    //         location : "roha",
                                                                                    //         country : "india",
                                                                                    //     })

                                                                                    //     sample.save()
                                                                                    //     .then(()=>{
                                                                                    //         console.log("test added");
                                                                                    //     })
                                                                                    //     .catch((err)=>{
                                                                                    //         console.log(err);
                                                                                    //     })

                                                                                    //     res.send("test done");
                                                                                    // })

//middleweres
const validate=(req,res,next)=>{
    let {error} = listing_schema.validate(req.body).error
    
    if(error){
        throw new ExpressError(400 , error)
    }
    else{
        next();
    }
}


//index route
app.get("/listing",wrapAsync( async (req,res)=>{
    res.render("home.ejs",{listings : await listing.find()});
}))

app.get("/listing/new", (req,res)=>{
    res.render("new.ejs");
})

app.get("/listing/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    res.render("show.ejs",{listing : await listing.findById(id)});
}))

app.post("/listing",validate,wrapAsync(async(req,res)=>{
    const new_listing=new listing(req.body.listing);
    await new_listing.save();
    res.redirect("/listing");
}))

app.get("/listing/edit/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let edit_listing = await listing.findById(id);
    res.render("edit_post.ejs",{listing : edit_listing});
}))

app.patch("/listing/edit/:id",validate,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listing/${id}`);
}))

app.delete("/listing/:id",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})


//error handlor
app.use((err,req,res,next)=>{
    console.log(err);
    // let {status =500,message = "something whent wrong"} = err;
    res.status(err.status).render("error.ejs",{errs : err});
})

