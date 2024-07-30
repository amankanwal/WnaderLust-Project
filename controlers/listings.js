const Listing  = require("../models/models")
module.exports.index =  async (request , response ) => {
    let allListings =  await Listing.find({}); 
    
    // console.log(allListings);
    response.render("listings/allListings.ejs", {allListings});
    // response.send("yes working ! ");
}