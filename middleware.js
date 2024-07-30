const Listing = require("./models/models");
const Review = require("./models/review");

module.exports.isLoggedin = (req , res , next )=> {
    console.log("code in login route  ");
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl)
        // console.log(" this is oginal url in locals " , res.se.redirectUrl);
        req.flash("error" , "loggin Please! ");
        return res.redirect("/login");
    }
    next()
};

module.exports.saveRedirectUrl = (req , res, next) => {

    console.log("code in saveroute ");

    if(req.session.redirectUrl){

        console.log("code in inside if block ! ");

        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
        
    }
    next();
}

module.exports.isOwner = async (request , response , next) => {

    let {id} = request.params;
    let listings  = await Listing.findById(id);

    if(!listings.user.equals(request.user._id)){
        console.log("listing.user : " , listings.user ,"\n" , "request.userr : " , request.user); 
        request.flash("error" , "Premission denied ! ")
       return  response.redirect("/listings");
    }
    next();

}

module.exports.isReviewOwner = async (request , response , next) => {
    let {id , reviewId} = request.params;

    let review = await Review.findById(reviewId);
    // console.log("maan le bhai maan le keh ra hu maan le" , review);
    if(!review.user._id.equals(request.user)){
        request.flash("error" , "you are not the owner ! of reveiw ! ");
        return response.redirect(`/listings/${id}`)
    }
    
    next();
}