const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/userModel');
const Listing = require('../models/listingModel');

exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  try {
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    user = new User({
      name,
      email,
      avatar,
      password
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
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
    console.log(err.message);
    res.status(400).json({ msg: err.message });
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    console.log('id:', req.user.id);
    const profile = await User.findById(req.user.id).select('-password');
    console.log(profile);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.status(201).json({
      status: 'success',
      users: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({ msg: 'No user by this Id' });
    }

    await user.update(req.body);

    res.status(200).json({ msg: 'Updated User' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getUserBidHistory = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      bids: { $elemMatch: { user: req.user.id } }
    }).populate('createdBy');

    res.status(200).json({
      status: 'success',
      listings: listings.length,
      data: {
        listings
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ msg: 'No user found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
