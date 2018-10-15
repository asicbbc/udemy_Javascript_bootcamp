// middleware 
var Camp = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj ={};


middlewareObj.isLoggedIn = function (req,res,next) {
    if (req.isAuthenticated()) {
        req.flash("success","You have logged in.")
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}

middlewareObj.checkCampGroundOwnerShip = function (req,res,next){
    var id=req.params.id; 
    var user=req.user;
    if (req.isAuthenticated()) {
        // does user own camground?
        
        Camp.findById(id ,function (err,foundCampground) {
            if (err) {
                console.log("ERROR: edit camp: findbyid "+err);
                req.flash("error","Campground not found");
                res.redirect("back");
            }
            else { //found campground OK
            
                //console.log(foundCampground.author.id); //object
                //console.log(user._id); //string
                
                // make sure foundCampground.author.id is defined
               if (foundCampground && foundCampground.author.id && foundCampground.author.id.equals(user._id)) {
                    //render show template
                    next();
                }
                else //not the same user
                {
                    console.log("you don't have permission to do that");
                    req.flash("error","You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        }); 
    }
    else {
        console.log("You need to be logged in to do that!");
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
    
}


middlewareObj.checkCommentOwnerShip = function(req,res,next){
    var id=req.params.comment_id;
    var user=req.user;
    
    if (req.isAuthenticated()) {
        // does user own camground?
        
        Comment.findById(id,function (err,foundComment) {
            if (err) {
                console.log("ERROR: edit camp: findbyid "+err);
                req.flash("error","Comment not found: "+err);
                res.redirect("back");
            }
            else { //found comment OK
            
                //console.log(foundCampground.author.id); //object
                //console.log(user._id); //string
                
                // make sure foundComment.author.id is defined
               if (foundComment.author.id && foundComment.author.id.equals(user._id)) {
                    //render show template
                    next();
                }
                else //not the same user
                {
                    console.log("you don't have permission to do that");
                    req.flash("you don't have permission to do that!");
                    res.redirect("back");
                }
            }
        }); 
    }
    else {
        console.log("You need to be logged in to do that!");
        req.flahs("You need to be logged in to do that!");
        res.redirect("back");
    }
    
}

module.exports = middlewareObj;