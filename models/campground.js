var mongoose = require ("mongoose");
var Comment  = require("./comment");

//schema setup
var campSchema = new mongoose.Schema({
    name: String,
    image:  String,
    description: String,
    price: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment" // ??? , content inside quote doesn't seem to matter
    }],
    author: {
            id:  {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
    }
} );

var Camp = mongoose.model("Camp",campSchema);
module.exports = Camp;