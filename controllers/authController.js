const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/userModel');

// Logs in a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    console.log(user);
    console.log(user._id);
    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Authenticate User
exports.authenticate = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log(token);
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    await jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.user;
        console.log(decoded.user);
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getActiveListingsByUser = async (req, res, next) => {
  try {
    const listings = await Listing.find(
      {
        createdBy: req.params.user_id
      },
      { active: true }
    );

    res.status(200).json({
      status: 'success',
      listings: listings.length,
      data: {
        listings
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
};
