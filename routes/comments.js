
//var SeedDB =  require("./models/seed");
var Comment = require("../models/comment");
var Camp = require("../models/campground");
var middleware=require("../middleware");  //index.js special name

var express = require("express");
var router = express.Router();


//====================
// Comments ROUTES
//====================

//Edit comments (Show form)
router.get("/campgrounds/:id/comment/:comment_id/edit", middleware.checkCommentOwnerShip, function(req, res) {
    var id=req.params.comment_id;
    var campid=req.params.id;

    Camp.findById(campid,function (err,foundCampground) {
        if (err) {
            console.log("ERROR: edit comment form : findbyid camp "+err);
        } else
        {
            Comment.findById(id , function (err,foundComment) {
                console.log("edit comment . found :" +foundComment);
                res.render("comment_edit",{comment:foundComment,camp:foundCampground});
            }); 
        }
 
    }) ;
});


//update comments route
router.put("/campgrounds/:id/comment/:comment_id", middleware.checkCommentOwnerShip, function(req, res) {
    var campid=req.params.id;
    var id = req.params.comment_id;
    var updateComment = req.body.comment;
    
    console.log( "\nUPDATED Comments "+updateComment );
    
    Comment.findByIdAndUpdate(id , updateComment, function (err,foundComment) {
        if (err) {
            console.log("ERROR: update comment: findbyid "+err);
            res.redirect("back");
        }
        else {
            //rener show template
            console.log("update comment. found :" +foundComment);
            //foundCampground.save();
            res.redirect("/campgrounds/"+campid);
        }
    });
    // res.send ("EDIT CAMPGROUND ROUTE")
}); 

// delete comment route
router.delete("/campgrounds/:id/comment/:comment_id", middleware.checkCommentOwnerShip, function (req,res) {
    var id = req.params.comment_id;
    var campid = req.params.id;

    Comment.findByIdAndDelete(id, function (err,foundComment) {
        if (err) {
            console.log("ERROR: Delete comment: findbyid "+err);
            res.redirect("/campgrounds");
        }
        else {
            console.log( "\nDelete comment id:"+id );
            res.redirect("/campgrounds/"+campid);
        }
    });
});



//NEW / add new comment form
router.get("/campgrounds/:id/comment/new", middleware.isLoggedIn, function (req,res) { //post request
    //var comment = req.body.comment;
    // var author  = req.body.author;
    var campid=req.params.id;
    Camp.findById(campid,function (err,foundCampground) {
        if (err) {
            console.log("ERROR: new comment form : findbyid "+err);
        }
        else {
            //rener show template
            console.log("found :" +foundCampground);
            res.render("newComment",{camp:foundCampground});
        }
    });
})


// CREATE comment with POST
router.post("/campgrounds/:id/comment",middleware.isLoggedIn, function(req, res) {
    var campid=req.params.id;
    var comment=req.body.comment;
    var user = req.user;
    
    Camp.findById(campid,function (err,foundCampground) {
        if (err) {
            console.log("ERROR: show temp: findbyid "+err);
            res.redirect("/campgrounds");
        }
        else {
            //console.log("found :" +foundCampground);
            Comment.create(comment, function(err, c){
                    if(err){
                        console.log(err);
                        req.flash("error","Something went wrong:"+err)
                    } else {
                        //add username and id to comment
                        c.author.id=user._id;
                        c.author.username = user.username;
                        c.save();
                        foundCampground.comments.push(c);
                        foundCampground.save();
                        console.log("Created new comment: "+c.text);
                        //console.log("redirect to "+"/campgrounds/"+campid)
                        req.flash("success","Sucessfully added comment");
                        res.redirect("/campgrounds/"+campid);
                    }
            });
        }
    });
});


//middleware 
function isLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;