const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../Utility/asyncWrap.js");
const Listing = require("../models/models.js");
const Review = require("../models/review.js");
const{reviewSchema} = require("../schema.js");
const {isLoggedin , isReviewOwner} = require("../middleware.js");
const MyError = require("../Utility/CustomErrors/MyError.js")
//review validation function : 
const validateReview = (req , res , next )=> {

    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMessage = error.details.map((el) => el.message).join();
        throw new MyError(400 , error);
    }else{
        next();
    }
    
};

// post request to save review

router.post("/" , isLoggedin, validateReview , wrapAsync (async (request , response , next ) => {

    let{id} = request.params;
    // console.log("id : is ",id);
    let listing = await Listing.findById(id)

    // let reviews = request.body.review;
// console.log(review);

    // console.log(request.body.review);
    let newReview = new Review(request.body.review)

    newReview.user = request.user;

    listing.review.push(newReview);
    // console.log(listing);

    await listing.save();
    await newReview.save();

    // console.log(reviews);
    response.redirect(`/listings/${id}`);
}));
//delete review 

router.delete("/:reviewId", isLoggedin, isReviewOwner, wrapAsync(async (request, response) => {
    let {id, reviewId} = request.params;
  
        // Update the Listing to remove the reference to the deleted review
    let and = await Listing.findByIdAndUpdate(id, { $pull: { review : reviewId } });

        // Find and delete the review
    await Review.findByIdAndDelete(reviewId);
    
    // console.log("this id review is deleted ! " , reviewId);
    response.redirect(`/listings/${id}`);
}));


module.exports = router;