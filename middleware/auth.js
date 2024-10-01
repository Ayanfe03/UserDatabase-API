const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'You must be logged in to access this route.' });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
      if (error) {
        console.log("error", error);
        res.status(401).json({ message: 'You must be logged in to access this route.' });
        return;
      }

      const user = await User.findOne({ where: { id: decoded.id } }); // decoded is our payload in userController

      if (!user) {
        res.status(401).json({ message: 'You must be logged in to access this route.' });
        return;
      }

      req.user = user;
      next();
    });
} catch (error) {
  res.status(500).json({ message: 'You are unauthorized for access' });
}
}

module.exports = { validateToken };