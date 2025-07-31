if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// jin require ko mene comment out kiya vo is file me use nhi ho rhe hai ab restructureing karne per.
const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const { render } = require("ejs");
// const {listingSchema,reviewSchema}=require("./schemaValidation.js");
// const Review=require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main()
    .then((res)=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOption={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
};


// app.get("/",(req,res)=>{
//     res.send("Hi, i am root");
// });


// yeh bhi middleware hi hai.
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    // console.log(res.locals.success);
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

// All Listings Routes
app.use("/listings",listingsRouter);
// All Reviews Routes
app.use("/listings/:id/reviews",reviewsRouter);
// User Routes
app.use("/",userRouter);

   

app.all("/{*any}",(req,res,next)=>{
    console.log(req.url);
    next(new ExpressError(404,"Page Not Found!"));
});

// error handler middleware
app.use((err,req,res,next)=>{
    let{statusCode=500, message="Somthing went wrong"}=err;
    // res.status(statusCode).send(message);
    console.log(err);
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080")
});


