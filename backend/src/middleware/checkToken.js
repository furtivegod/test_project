// middleware/checkToken.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const checkToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;  // Attach decoded user data to request object
    next();  // Proceed to the next middleware or controller
  });
};

module.exports = checkToken;
