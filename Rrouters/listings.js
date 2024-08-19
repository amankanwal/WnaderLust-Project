const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utility/asyncWrap.js");
const Listing = require("../models/models.js");
const { isLoggedin, isOwner } = require("../middleware.js");
const listingControler = require("../controlers/listings.js")
router.get("/" , listingControler.index)
router.get("/listings" , listingControler.index)
const MyError = require("../Utility/CustomErrors/MyError.js")
//new list form
const multer = require("multer");
const { storage } = require("../cloudCionfuig.js");
const upload = multer({storage})

router.get("/new",isLoggedin , (request , response) => {
   
    response.render("/listings/newList.ejs");

})

//post route 
router.post("/listings/new" ,  upload.single("newList[image]")/* paramerter name sholud match with input name attribute */, wrapAsync (( async (request , response , next ) => {
    let url = request.file.path;
    let filename = request.file.filename;
    console.log("filename nad fielurl" , url , filename);
    const newList = new Listing(request.body.newList);
    newList.user = request.user._id;

    newList.image = {url , filename}
    await newList.save();
    request.flash("success" , "List add ho gai ! ");

    //This is falash message we can flash a message as our listng is saved 
    console.log(request.file)
    response.redirect("/listings")

})));


// route for a seprate id

router.get("/listings/:id" , wrapAsync (async (request , response ) => {
    
    let {id} = request.params;
    let singleList = await Listing.findById(id)
    .populate({
        path : "review",
        populate : {
            path : "user"
        },
    })
    .populate("user");
    // console.log("this is fully populated SingleList : " , singleList);
    // console.log(  " single list ", singleList.user._id , " this is req user id " , request.user._id)
    if(!singleList){
        request.flash("error" , "This list is Deleted , Sorry");
        response.redirect("/listings");
    }
    response.render("listings/singlList.ejs" , {singleList});
} ));



//edit route 
router.get("/listings/:id/edit" ,isOwner, async (request , response ) => {

    let {id} = request.params;
    let singleList = await Listing.findById(id);

    // console.log("request session : " , request.session.redirectUrl);

    response.render("listings/edit.ejs" , {singleList});

})

//update route put request
router.put("/listings/:id" ,
    isLoggedin,
    isOwner,
    upload.single("update[updatedImageUrl]"),
    wrapAsync (async (request , response ) => {
    
    let {id} = request.params;
   
    let url = request.file.path;
    let filename = request.file.filename;
    
    let updates = request.body.update;
   
    // console.log(updates); 
     let updatedListing = await Listing.findByIdAndUpdate( id ,
        {description : updates.updatedDescription , price : updates.updatedPrice ,    image : {url , filename}, title : updates.updatedTitle } ,
    {new:true});
 

   

    
  

    let singleList = await Listing.findById(id);
    request.flash("success" , "list updated sucessfully! ");
    response.redirect("/listings");
}));

//delete route 

router.delete("/listings/:id" ,isLoggedin,isOwner, wrapAsync ( async (request , response ) => {

    let {id} = request.params;
    
    await Listing.findByIdAndDelete(id);
    
    request.flash("remove" , "List Deletd successfully !");
    response.redirect("/listings");

}));


module.exports = router;
