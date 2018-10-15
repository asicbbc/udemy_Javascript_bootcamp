
// yelp camp user


var mongoose = require("mongoose");

//var localStrategy = require("passport-local");
// var passport = require ("passport");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);

