
var express = require("express");
var middleware=require("../middleware");  //index.js special name
var router = express.Router();


//var request = require('request');
//var bodyparser = require("body-parser");
//var mongoose = require ("mongoose");
var Camp = require("../models/campground");
//var SeedDB =  require("./models/seed");
var Comment = require("../models/comment");

function addToDB(campmodel, camp) {
    campmodel.create(camp, function (err,c) {
        if (err) {
            console.log("Camp.create: ERROR mongoose in creating a new camp");
        }
        else {
            console.log("camp.create: added camp "+c);
        }
    });
    
}


//====================
//Campgrounds Routes
//====================

//CREATE campground
router.post("/campgrounds", middleware.isLoggedIn, function (req,res) { //post request
    //get data from from and add to campgrounds array
    //redirect back to campground page
    var campName = req.body.campName;
    var campImgUrl = req.body.campUrl;
    var campDescription= req.body.campDescription;
    var campPrice = req.body.campPrice;
    var user = req.user;
    

    var author ={
        username:user.username,
        id: user._id
    };
    var newCampGround = {name:campName,image:campImgUrl,description:campDescription, author:author,
                         price:campPrice};

    
    addToDB(Camp,newCampGround);
    console.log("user enter new camp "+campName+" "+campImgUrl+" by user:"+user.username);
    // campgrounds.push(newCampGround);
    res.redirect("/campgrounds");
    
});

// NEW /show form to creat new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("newCampGroundForm");
});



//INDEX
router.get("/campgrounds",function(req, res) { //get request
    var title = " Welcome To YelpCamp!";
    // console.log(req.user);

   Camp.find({},function (err,c) {
            if (err) {
                console.log("Camp.find: ERROR "+err);
            }
            else {
                console.log("Camp.find: Loading camps from db ");
                // console.log(c);
                res.render("index",{campgrounds:c,title:title, currentUser:req.user});
            }
        });
    // res.send(parseData);
});

// show template. show more info about one campground
router.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    //render show template with ID
    var id=req.params.id;
    Camp.findById(id).populate("comments").exec(function (err,foundCampground) {
        if (err) {
            console.log("ERROR: show temp: findbyid "+err);
        }
        else {
            //rener show template
            //console.log("found :" +foundCampground);
            res.render("show",{camp:foundCampground});
        }
    });
});


//edit campground route (show form)
router.get("/campgrounds/:id/edit", middleware.checkCampGroundOwnerShip, function(req, res) {
    var id=req.params.id;
    var user=req.user;
 
    Camp.findById(id , function (err,foundCampground) {
            console.log("edit camp . found :" +foundCampground);
            res.render("campground_edit",{camp:foundCampground});
    }); 
    
 
}) ;



//update campground route
router.put("/campgrounds/:id",  middleware.checkCampGroundOwnerShip, function(req, res) {
    var id = req.params.id;
    var updateCamp = req.body.campGround;
    console.log( "\nUPDATED CAMP GROUND "+updateCamp.name );
    Camp.findByIdAndUpdate(id , updateCamp, function (err,foundCampground) {
        if (err) {
            console.log("ERROR: update camp: findbyid "+err);
            res.redirect("/campgrounds");
        }
        else {
            //rener show template
            console.log("update camp . found :" +foundCampground);
            //foundCampground.save();
            res.redirect("/campgrounds/"+id);
        }
    });
    // res.send ("EDIT CAMPGROUND ROUTE")
}); 

// delete campground route
router.delete("/campgrounds/:id",  middleware.checkCampGroundOwnerShip, function (req,res) {
    var id = req.params.id;
    console.log( "\nDelete CAMP GROUND id:"+id );
    Camp.findByIdAndDelete(id , function (err,foundCampground) {
        if (err) {
            console.log("ERROR: delete camp: findbyid "+err);
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success","Comment removed!");
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;
