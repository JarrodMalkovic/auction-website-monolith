const express = require('express');
const router = express.Router();

const authController = require('../../controllers/authController');
const userController = require('../../controllers/userController');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', authController.authenticate, userController.getMyProfile);

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post('/', authController.loginUser);

module.exports = router;
