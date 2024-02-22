const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cloudinary = require('./config/cloudinary'); 
const app = express();

// Load environment variables
require('dotenv').config();

// Set up port
const PORT = process.env.PORT || 4000;

// Enable CORS for all routes
app.use(
    cors({
        origin: '*',
    })
);

// Middleware to parse JSON in request body
app.use(express.json());

// File upload middleware
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
    })
);

// Database connection
const DBconnector = require('./config/database');
DBconnector();

// Cloudinary connection
cloudinary.cloudinaryConnect();

// Include your blog routes
const blog = require('./routes/blog');
app.use('/api/v1', blog);

const user = require('./routes/user');
app.use('/api/v1',user)



// Start the server
app.listen(PORT, () => {
    console.log(`Server Started at Port Number ${PORT}`);
});