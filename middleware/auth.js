const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // !  the verify jwt token and sign key should be the same
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId).select('username email role'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * authentication user role only admin can access to see user list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const authAdmin = (req, res, next) => {
    console.log(req.user)
    if(req.user?.role !== 'admin') return res.status(403).send({message: "Access denied: Insufficient permissions"});
    next();
}

module.exports = { authenticate , authAdmin};