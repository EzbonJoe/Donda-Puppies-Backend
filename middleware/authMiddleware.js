const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js'); // Adjust path if needed

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token is provided in Authorization header
  if(authHeader && authHeader.startsWith('Bearer ')){
    const token = authHeader.split(' ')[1];

    try {
        // Verify token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if tokenVersion matches
        const user = await User.findById(decoded.id).select("id tokenVersion isAdmin");

        if (!user) {
          return res.status(401).json({ message: "User not found" }); 
        }

        if (decoded.tokenVersion !== user.tokenVersion) {
          return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        
        req.user = user; // Attach decoded user info to the request
      next(); // Pass control to the next middleware/route handler
    } catch (err) {
      console.error("JWT verification error:", err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  
  }else{
    return res.status(401).json({ message: 'Authorization token is required' });
  }
}

module.exports = { protect };