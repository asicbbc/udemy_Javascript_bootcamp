
var express = require("express");
var router = express.Router();

var middleware=require("../middleware");  //index.js special name

//var bodyparser = require("body-parser");
//var mongoose = require ("mongoose");
//var Camp = require("./models/campground");
//var SeedDB =  require("./models/seed");
var Comment = require("../models/comment");
var passport = require ("passport");
//var localStrategy = require("passport-local");
//var passportLocalMongoose = require("passport-local-mongoose");
var User = require("../models/user");

//====================
// Auth ROUTES
//====================
//register form
//logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","You have logged out!")
    res.redirect("/");  // back to landing page
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//handling user sign up
//middleware
router.post("/login", 
        passport.authenticate("local",               //middleware
            {   successRedirect:"/campgrounds",
                failureRedirect:"/login"
            }
        ), function(req, res) {
            //var user=req.body.user;
           }
);

//show sign up form
router.get("/register", function(req, res) {
    res.render("register");
})

//handling user sign up
router.post("/register", function(req, res) {
    var pw=req.body.password;
    var un=req.body.username;
    User.register(new User({username:un}), pw, function (err,u) {
        if (err) {
            console.log("ERROR"+err);
            req.flash("error","Something wrong: "+err)
            return res.redirect("/register");
        }
        else {
            req.flash("success","Welcome to YelpCamp "+u.username);
            passport.authenticate("local")(req,res, function () {
                res.redirect("/campgrounds");
            });
        }
    });
    
    // res.send("register post route "+ user.username);
});

// //add in middleware to check user is login before showing page
// app.get("/secret", isLoggedIn, function(req, res) {
    
//     res.render("secret");
// })

//HOME/LANDING page
router.get("/", function (req,res) { //request / response
    var title = "YelpCamp Home";
    
    res.render("home.ejs", {title:title}); // in views directory
    //res.send("home.ejs");
    //res.send("<h1>Hi There, welcome to my assignment!</h1>");
})


router.get("/*", function (req,res) { //request / response
    var title = "YelpCamp Home";
    
    res.redirect("home"); // in views directory
 
})

module.exports = router;