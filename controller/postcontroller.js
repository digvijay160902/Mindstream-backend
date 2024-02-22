
const cloudinary = require("cloudinary").v2;

const Post = require('../model/postmodel');
const User = require('../model/user')

function isFileTypeSupported(fileType, supportedTypes) {
    return supportedTypes.includes(fileType);
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto"
    
    try {
        const response = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "BlogApp",
            quality: 50,
            options,
            timeout: 120000 
        });
                
        return response;
    } catch (error) {
        if (error && error.http_code === 499) {
            console.error('Cloudinary request timed out:', error.message);
            // Handle timeout error, retry or return an appropriate response
        } else {
            console.error('Error uploading to Cloudinary:', error.message);
            // Handle other errors
        }
        throw error;
    }
}



exports.createPost = async (req, res) => {
    try {

        const { title,body,user,user_id } = req.body;
        console.log("title ",title, "body -> " ,body, "user -> ", user);

        // Fetch file 
        const imageFile = req.files.img;
        console.log(imageFile);

        const supportedTypes = ["png", "jpg", "jpeg"];
        const fileType = imageFile.name.split('.')[1].toLowerCase();

        // Check file type is supported or not 
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File type not supported"
            })
        }

        // Upload to Cloudinary
       
        const response = await uploadFileToCloudinary(imageFile, "BlogApp", 50);
        console.log(response)


        // Upload to DB 
        const fileData = await Post.create({
            title,
            body,
            user,
            img: response.secure_url
        })

        const updatedUser = await User.findByIdAndUpdate(
            user_id,
            {$push:{blogs:fileData._id}},
            {new:true}
        )


        res.status(200).json({
            success: true,
            message: "blog posted successfully",
            data: fileData,
            User:updatedUser
        })

    }
    catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Something went wrong"
        })
    }
}
    
exports.getAllPost = async (req,res) =>{

    try{

        const Posts = await Post.find().populate("comments").exec();

        res.status(200).json({
            body:Posts,
        })
    }

    catch(error){

        res.status(500).json({
            message:"unable to fetch the details",
            error:error.message,
        })
    }
}

// controller to delete the post
exports.deletePost = async (req, res) => {
    try {

        const { postId ,userId} = req.body;
        

        const deletedPost = await Post.findByIdAndDelete(postId);

        const updatedUser = await User.findByIdAndUpdate(
           userId, 
           {$pull:{blogs:postId}},
           {new:true}
        )

        if (deletedPost) {
            res.status(200).json({
                success: true,
                body: deletedPost,
                message: "Post deleted successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

    } catch (err) {
        console.log("Something went wrong");
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


exports.getPost = async (req,res) =>{

    try{
        
        const { postId } = req.params;
       
        const post = await Post.findOne({_id : postId});
        console.log(post);
        if(!post){

            return res.status(404).json({

                status:false,
                message:"Post Not found",

            })
        }

        return res.status(200).json({
            
            status:true,
            message:"Post found",
            body:post
        })

    }
    catch(err){
        
        return res.status(500).json({
            
            success:false,
            message:err.message,
        })
    }

};

exports.userPost = async (req,res) =>{

    try{
        
        const { postId } = req.body;
       
        const post = await Post.findOne({_id : postId});
        console.log(post);
        if(!post){

            return res.status(404).json({

                status:false,
                message:"Post Not found",

            })
        }

        return res.status(200).json({
            
            status:true,
            message:"Post found",
            body:post
        })

    }
    catch(err){
        
        return res.status(500).json({
            
            success:false,
            message:err.message,
        })
    }

};




