const mongoose = require('mongoose');

// route handler
const likeSchema = new mongoose.Schema({

    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

});

// export
module.exports = mongoose.model("Like",likeSchema);