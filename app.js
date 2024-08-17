    require("dotenv").config();
    console.log(process.env)
    
    const express = require("express");
    const mongoose = require("mongoose")
    const Listing = require("./models/models.js");
    const Review = require("./models/review.js");
    const path = require("path");
    const methodOverride  = require("method-override");
    const ejsMate = require("ejs-mate");
    const{reviewSchema} = require("./schema.js");
    const { request } = require("http");
    const wrapAsync = require("./Utility/asyncWrap.js");
    const MyError = require("./Utility/CustomErrors/MyError.js");
    const app = express();
    const joi = require("joi");
    const { error } = require("console");
    const cookieParser = require('cookie-parser');
    //Autehnticaltions 
    const passport = require("passport");
    const LocalStrategy = require("passport-local");
    const User = require("./models/user.js");
    //sessions 
    const session = require("express-session");
    const MongoStore = require('connect-mongo');
    const flash = require("connect-flash");

    //requireing listing router ! 
    const listingRouter = require("./Rrouters/listings.js");
    //requering review router 
    const reviewRouter = require("./Rrouters/review.js");
    //requering user router
    const userRouter = require('./Rrouters/user.js');

    const dbUrl = process.env.ATLAS_DB;
    const secret = process.env.SECRET_VALUE
     store = MongoStore.create({
        mongoUrl : dbUrl,
        crypto : {
            secret:secret
        },
        touchAfter:24*36000,
    })
    store.on("error" , ()=> {
        console.log("error in mongo session store " , err)
    })
    //session options 
    const sessionOptions = {
        store,
        secret :secret ,
        resave : false,
        saveUninitialized : true,

        cookie : {
            expires : Date.now() + (7 * 24 * 60 * 60 * 1000),
            maxAge : 7 * 24 * 60 * 60 * 1000 ,
            httpOnly : true,    
        }

    }
    
    //setup Middlewares ! 
    app.use(session(sessionOptions));
    app.use(flash());

    //Authenticaltions 
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy( User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    //flash messages ! 
    app.use((request , response , next) => {
        
        response.locals.req = request;
        response.locals.success = request.flash("success");
        response.locals.error = request.flash("error");
        // console.log("respones locals is : ",response.locals);
        next();
    });


    app.use(express.urlencoded({extended : true}));
    app.use(methodOverride("_method"));
    app.use(express.static(path.join(__dirname , "/public")));
    // useing router for application : 
    app.use('/' , userRouter);
    app.use('/listings', listingRouter);
    app.use('/listings/:id/review' , reviewRouter);

    app.use(cookieParser());
     
    //main fucniton ! for caling database ! 
    async function main(){
        await mongoose.connect(`${dbUrl}`);
    }

    //ejs mate 
    app.engine('ejs' , ejsMate);
    app.set("view engine" , "ejs");
    app.set("views" , path.join(__dirname , "views"))

    //setup databases ! 
    main().then(()=>{
        console.log("database connected app.js !")
    }).catch((e)=>{
        console.log("error in db : " , e);
    })

    //listing on port ! 
    app.listen(8080 , () => {
        console.log("listening");
    })

    app.get("/"  , (request , response ) => {
        response.render(  "/listings");
    })


    //error handler 
    app.use((err , request , response , next)  => {

        console.log("Fall into error handler !");
        response.render("./listings/error.ejs" ,{message : err.message});

    })
