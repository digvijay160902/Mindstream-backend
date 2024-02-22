const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
    },

    email :  {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    likedPosts: [{
        type: mongoose.Types.ObjectId,
        ref: "Post",
    }],

    Comments :[{
        type:mongoose.Types.ObjectId,
        ref:"Post",
    }],

    blogs: [{ type: mongoose.Types.ObjectId, ref: "Post", }],
})

module.exports =  mongoose.model("User", userSchema);