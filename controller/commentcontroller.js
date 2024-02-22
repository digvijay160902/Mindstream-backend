// we require model
const Comment = require('../model/commentmodel');
const Post = require('../model/postmodel');
const User = require('../model/user')

// define the controller
exports.createComment = async (req,res) =>{

    try{

        // fecth the data from request
        const{post_id,user_id,data} = req.body;

        // create a post object to insert
        const comment = new Comment({
           post:post_id,
           user:user_id,
           body:data
        });

        // just insert the comment in the database
        const savedComment = await comment.save();

        // find the post id and new comment to its comment arrays
        const updatedPost = await Post.findByIdAndUpdate(post_id,
            {$push:{comments:savedComment._id}}, 
            {new:true})
            
        
        //  update user as well
        const udpatedUser = await User.findByIdAndUpdate(
            user_id,
            {$push:{Comments:post_id}},
            {new:true}
        )

        res.status(200).json({
            post: updatedPost,
            user:udpatedUser,
            message:"comment added successfully"
        })
        
    }

    catch(error){

        res.status(500).json({
            error:error.message,
            message:"couldnot updated the data"
        })
    }
    
    
}

// get the comment

exports.getComment = async (req,res) =>{

    try{
        
        const { commentId } = req.params;
       
        const comment = await Comment.findOne({_id : commentId});
       
        if(!comment){

            return res.status(404).json({

                status:false,
                message:"Comment Not found",

            })
        }

        return res.status(200).json({
            
            status:true,
            message:"Comment Found",
            body:comment
        })

    }
    catch(err){
        
        return res.status(500).json({
            
            success:false,
            message:err.message,
        })
    }
}