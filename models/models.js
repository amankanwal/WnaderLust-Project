const mongoose = require("mongoose")
const Review = require("./review");
const { string } = require("joi");

const dbUrl = process.env.ATLAS_DB
    //main fucniton ! for caling database ! 
    async function main(){
        await mongoose.connect(`${dbUrl}`);
    }


main().then(()=>{
    console.log("database connected model.js !")
}).catch((e)=>{
    console.log("error in db : " , e);
})

// mongoose.Schema is a class : and we are making its instance Schema !
const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        uppercase : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
          url:String,
          filename : String, 
    },
    price : {
        type : Number,
        required : true
    },
    country:{
        type:String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    review : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})
//pre middleware or findAndDelete query 
listingSchema.pre("findOneAndDelete" , () => {
    console.log("thid is pre middleware calked before delete listing! ")
})
//post middleware for findByidAndDelete! 
listingSchema.post("findOneAndDelete" ,async (list) => {

    console.log(list);
    let kuchBhi = await Review.deleteMany({ _id : { $in : list.review }});
    console.log(kuchBhi);

});

const Listing = mongoose.model("Listing" , listingSchema); // This is our Class model class work as collection and its instances are work like Documents !

module.exports = Listing;