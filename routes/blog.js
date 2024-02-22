const express = require("express");
const router = express.Router();
const {auth} = require("../middleware/auth");

// import cntroller

// const {dummyfun} = require('../controller/dummyController');
const {createComment, getComment}= require('../controller/commentcontroller');
const {createPost , getAllPost , deletePost,getPost, userPost} = require('../controller/postcontroller');
const {likePost,unlikePost} = require('../controller/likecontroller')
// do the mapping

router.post("/comment", auth,createComment);
router.post("/createPost",auth,createPost);
router.delete("/deletePost",auth,deletePost);
router.get("/Posts",getAllPost);
router.post("/likes/like",auth,likePost);
router.post("/likes/unlike",auth,unlikePost);
router.get("/post/:postId",getPost);
router.get("/getComment/:commentId",getComment);
router.post("/userPost",userPost);

module.exports = router