const mongoose = require("mongoose");
const intiData = require("./data.js");
const Listing = require("../models/models.js");


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main().then(()=>{
    console.log("database connected model.js !")
}).catch((e)=>{
    console.log("error in db : " , e);
})
 
// console.log(intiData.data);
// /initialize Database 

let initializeDatabase = async () => {
    //first we clean our data basae 
    await Listing.deleteMany({});
    intiData.data = intiData.data.map((obj) => (

        {...obj , user : "66a65d99b71822c517ec0cb4"}

    ));
    await Listing.insertMany(intiData.data);
}
initializeDatabase().then(()=>{
    console.log("dtata SAvaed ")
}).catch((e)=>{
    console.log("error is : " ,e)
});

