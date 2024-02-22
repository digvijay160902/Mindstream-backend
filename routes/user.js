const express = require("express");
const {  getAllUser , signUp , login, getUser } = require("../controller/user-controller");
const userRouter = express.Router();


userRouter.post("/signup", signUp);
userRouter.post("/login" , login);
userRouter.get("/getUser/:userId",getUser)

module.exports =  userRouter;