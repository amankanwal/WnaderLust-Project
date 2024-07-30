const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    commnet : {
        type : String,
    },
    rating:{
        type : Number,
        min : 1,
        max :5,
    },
    date : {
        type : Date,
        default : Date.now(),
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

reviewSchema.pre('save' , ()=> {
    
    console.log("this is called before reeview saved ! ");

})

reviewSchema.post('save' , ()=>{
    console.log("Tihs is called after review saved ! ")
})
const Review = mongoose.model("Review" , reviewSchema);

module.exports = Review;
