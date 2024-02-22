const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const saltRounds = 10;



const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Valid email domains that are allowed to sign up
  const allowedDomains = ["gmail.com"]; // Add your valid domains

  // Extract the domain from the email
  const emailDomain = email.split('@')[1];

  // Check if the email domain is allowed
  if (!allowedDomains.includes(emailDomain)) {
      return res.status(400).json({ message: "Invalid email domain. Please use an official email account." });
  }

  let existingUser;

  try {
      existingUser = await User.findOne({ email });
  } catch (e) {
      console.log(e);
  }

  if (existingUser) {
      return res.status(400).json({ message: "User is already exists!" });
  }

  try {
      // Generate a salt
      const salt = bcrypt.genSaltSync(10);

      // Hash the password with the generated salt
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = new User({
          username,
          email,
          password: hashedPassword,
      });

      await user.save();
      return res.status(201).json({ message:"Account created Successfully" });
  } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal Server Error" });
  }
};

  

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("email is ", email);
        console.log("password is ",password);
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        // check for register user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }

        // Verify password & generate a JWT token

        const payload = {
            email: user.email,
            id: user._id,
        };

        if (await bcrypt.compare(password, user.password)) {
        
            const expiresIn = 10 * 60;

            // Generate JWT token with expiration time
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn,
            });

            // Calculate token expiration time in milliseconds
            const expirationTime = new Date().getTime() + expiresIn * 1000;

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            res.status(200).json({
                success: true,
                token,
                expiresIn: expirationTime, // Send expiration time in the response
                user,
                message: "User logged in successfully",
            });
        } else {
            // password not match
            return res.status(403).json({
                success: false,
                message: "Password does not match",
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

const getUser = async (req,res) =>{

    try{
        
        const { userId } = req.params;
       
        const user = await User.findOne({_id : userId});
        console.log("user detatails ",user);
        if(!user){

            return res.status(404).json({

                status:false,
                message:"userName not found",

            })
        }

        return res.status(200).json({
            
            status:true,
            message:"user found",
            body:user
        })

    }
    catch(err){
        
        return res.status(500).json({
            
            success:false,
            message:err.message,
        })
    }

};


module.exports = { signUp ,login,getUser};