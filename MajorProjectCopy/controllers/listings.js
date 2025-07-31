const Listing=require("../models/listing");
const axios =require("axios");

// yhe index route ka callback hai.
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find();
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{ 
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing}); 
};

module.exports.createListing=async (req,res,next)=>{
    const mapApi=process.env.MAP_API_KEY;
    const location = req.body.listing.location;
    let response = await axios.get(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json`, {
    params: {
        key: mapApi,
        limit: 1
    },
    });

    // console.log(response.data.features[0].geometry);
    
    // Point 1
    // let{title,description,image,price,country,location}=req.body;

    // OR - iske liye new.ejs me bhi changes kiye

    // console.log(req.body);
    // let listing=req.body.listing;
    // console.log(listing);
    // let newListing=await new Listing(listing);

    // Point 2
    // if(! req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    // if(! req.body.listing.title){
    //     throw new ExpressError(400,"Title is missing");
    // }
    // if(! req.body.listing.description){
    //     throw new ExpressError(400,"Description is missing");
    // }
    // if(! req.body.listing.location){
    //     throw new ExpressError(400,"Location is missing");
    // }

    // OR ya joi package de karo.

    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }

    // OR--> isko middleware banakar karo
    
    // point 1 ko finallay ase likha
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url, "--", filename);
    const  newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.data.features[0].geometry;
    let savedListing= await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created!"); //  isko render karne ke liea middleware me response ke local variable me likha.
    res.redirect("/listings");
};

module.exports.editForm=async (req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl}); 
};

module.exports.updateListing=async (req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let{id}=req.params;
    let deleteListing= await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.listingFilter=async(req,res)=>{
    let{category}=req.params;
    // console.log(category);
    if(category=="trending"){
        const allListings=await Listing.find();
        return res.render("listings/index.ejs",{allListings});
    }
    const allListings=await Listing.find({category});
    if(allListings.length==0){
        req.flash("error","Listings is not available for this Category");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs",{allListings});
}

module.exports.searchBar=async(req,res)=>{
    // console.log(req.query);
    let {destination}=req.query
    // console.log(destination);
    const allListings=await Listing.find({country:destination});
    if(allListings.length==0){
        req.flash("error","Listings is not available in this country");
        return res.redirect("/listings");
    } 
    res.render("listings/index.ejs",{allListings});
}


