// https://nodejs-init-asicbbc.c9users.io/
// ejs is in views subdir

var express = require("express");
var app=express();
var flash= require("connect-flash");

//var request = require('request'); 
var bodyparser = require("body-parser");
var mongoose = require ("mongoose");
var Camp = require("./models/campground");
var SeedDB =  require("./models/seed");
var Comment = require("./models/comment");

var passport = require ("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var methodOverride = require("method-override");

//requiring routes
var commentRoutes = require("./routes/comments");
var campgroundsRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");



app.use(bodyparser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/yelp_camp_v9",{ useNewUrlParser: true });
app.use(methodOverride("_method"));
app.use(flash()); //connect-flash

//PASSPORT CONFIGURATION
app.use(require("express-session") ({
    secret: "Jun's YelpCamp from Udemy",  //encode/decode session
    resave: false,
    saveUninitialized: false
}));

//setup passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname+"/public"));  // allow access to public dir, for css etc
app.set("view engine","ejs"); // ejs file extension

//misc function
SeedDB();

//================================================
//make currentUser availible to every ejs page!!!!
//================================================
app.use(function (req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success= req.flash("success");
    next();
})


app.use(commentRoutes);
app.use(campgroundsRoutes);
app.use(authRoutes);



//url from "Preview" tab
//https://nodejs-init-asicbbc.c9users.io/
// for postman to work, need to make the application 'PUBLIC' via Share tab

app.listen(process.env.PORT, process.env.IP, function() {
    console.log ("YelpCamp Server has started!");
    console.log("IP: "+process.env.IP+"   Port:"+process.env.PORT);
    console.log("url: https://nodejs-init-asicbbc.c9users.io/");
});
