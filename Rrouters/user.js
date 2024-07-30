const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require("../Utility/asyncWrap.js");
const flash = require("connect-flash");
const passport = require("passport");
const {  isLoggedin, saveRedirectUrl } = require("../middleware.js");
// const {isLoggedin} = require("../middleware.js");

// Routes

// Register a demo user!
router.get("/signup", wrapAsync(async (request, response) => {
    
    response.render("users/signup.ejs");

}));

router.post("/signup", saveRedirectUrl, wrapAsync(async (request, response) => {
console.log("flowing in signup  ")
    const { email, username, password } = request.body;

    try {

        let user = new User({ email, username });

        let registeredUser = await User.register(user, password);

        request.login(registeredUser , (error) => {
console.log("flowing in login ")
            if(error){
                console.log("flowing in error  ")

                return next(error);
            }else{
                console.log("flowing in esle error  ")
                request.flash("success", `Welcome ${username}`);
                response.redirect(`/listings`);
            }

        })
       
    }catch (error) {
        // console.log("Error during registration:", error);
        request.flash("error", `User ${username} already exists or other error: ${error.message}`);
        response.redirect("/signup");

    }
}));

router.get('/login' , (request , response ) => {
    response.render('users/login.ejs')
})

router.post ('/login',
    saveRedirectUrl,
    passport.authenticate('local',{ 

        failureRedirect: '/login',
        failureFlash : true

    }),

    async (req, res) => {

        req.flash("success" , `Welcome back to WnderLust ! `);
        console.log(res.locals);
        res.redirect( "/listings");

    }
);

router.get("/logout", isLoggedin, (req, res, next) => {

    req.logout((error) => {

        if (error) {
            return next(error); // Pass the error to the error handler middleware
        }

        req.flash("success", "Logged out!");
        res.redirect("/listings");

    });
});
    

module.exports = router;
