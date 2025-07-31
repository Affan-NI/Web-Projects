const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' }) //yha mukter files ko uploads folder me stor kara rahe tha
//  OR 
const upload=multer({storage}); // yha multe files ko cloudinary ki storage me save karega

// // Index Route.
// // router.get("/",wrapAsync(async (req,res)=>{
// //     const allListings=await Listing.find();
// //     res.render("listings/index.ejs",{allListings});
// // }));
// // OR
// router.get("/",wrapAsync(listingController.index));

// // New Route
// router.get("/new",isLoggedIn, listingController.renderNewForm); // listings ko create karne ke lie user logged in hona chaiye.

// // Show Route
// router.get("/:id",wrapAsync(listingController.showListing));  

// // Create Route
// router.post("/", isLoggedIn, validateListing,wrapAsync(listingController.createListing));

// // Edit Route
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));

// // Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing,wrapAsync(listingController.updateListing));

// // Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//----------------------OR-----------------------//


// index and creat route -- inko combine karke likhna bcoz inka route same hai.
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, 
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing
    ));
    
// New Route--is rout ko id vale rout se uper hi likhege if neeche likhte to vo isko bhi id vale me find karta.
router.get("/new",isLoggedIn, listingController.renderNewForm); 

// route for search bar 
router.get("/search",listingController.searchBar);

// show, update, delete Route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));

// Rout for filter by icon.
router.get("/:category/filter",wrapAsync(listingController.listingFilter));
    
module.exports=router;

