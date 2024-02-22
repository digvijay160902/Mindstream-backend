const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: 'Please login First',
            });
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (e) {
            return res.status(401).json({
                success: false,
                message: "Please login First"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while login"
        });
    }
};
