const mongoose = require('mongoose');

// route handler
const postSchema = new mongoose.Schema({

    title:{
       type:String,
       required:true
    },
    
    body:{
        type:String,
        required:true,
    },

    user:{
        type:String,
        required:true,
    },

    img:{
        type:String
    },

    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],

    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Like"
    }]
});

// export
module.exports = mongoose.model("Post",postSchema);