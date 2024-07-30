const joi = require("joi");

module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating : joi.number().required().min(0).max(5),
        commnet : joi.string().required(),
    }).required(),
});


// module.exports.newListSchema = joi.object({
//     newList : joi.object({
//         title: joi.string().required(),
//         description : joi.string().required(),
//         price : joi.number().required(),
//         country : joi.string().required(),
//         location : joi.string().required(),
//     }).required(),
// })
