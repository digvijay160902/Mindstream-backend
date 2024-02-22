const Post = require("../model/postmodel");
const Like = require("../model/likemodel");
const User = require("../model/user");


// Like a Post
exports.likePost = async (req, res) => {
  try {

    const { post_id, user_id } = req.body;

    const like = new Like({
      post:post_id,
      user:user_id,
    });

    const savedLike = await like.save();

    // Update Post Collection basis on this
    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      { $push: { likes:user_id } },
      { new: true }
    )
    .populate("likes")
    .exec();

    const updateUser = await User.findByIdAndUpdate(
      user_id,
      { $push: { likedPosts: post_id } },
      { new: true }
    )

    return res.status(200).json({
      message:"like added",
      post: updatedPost,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Error While Like Post",
    });
  }
};

// Unlike a Post
exports.unlikePost = async (req, res) => {
  try {
    const { post_id, user_id } = req.body;

    // find and delete the from like collection
    const deletedLike = await Like.findOneAndDelete({ post: post_id, user:user_id});

    // update the post collection
    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      { $pull: { likes: user_id } },
      { new: true }
    );

    // update the user collection
    const updateUser = await User.findByIdAndUpdate(
      user_id,
      { $pull: { likedPosts: post_id } },
      { new: true }
    )

    return res.status(200).json({
      message:"like removed",
      post: updatedPost,
    });
    
  } catch (err) {
    return res.status(500).json({
      error: "Error While unLike Post",
    });
  }
};
