const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const User = require('../models/User');
exports.authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expect "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified; // Add decoded token payload to the request
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// exports.authorizeRole = (role) => {
//     return (req, res, next) => {
//       const user = User.findOne({_id : objectId(req.user)});
//       console.log(user);
//       if (user.UserType !== role) {
//         return res.status(403).json({ message: 'Access denied' });
//       }
//       next();
//     };  
//   };

exports.authorizeRole = (role) => {
  return async (req, res, next) => {
    try {
      // Fetch the user from the database
      const user = await User.findById(req.user.id); // req.user.id is set by authenticateToken
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the user has the required role
      if (user.UserType !== role) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      next(); // User has the correct role; proceed to the next middleware or route handler
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};