const express = require('express');
const router = express.Router();

const {
	registerUser,
	loginUser,
	forgotPassword,
	resetPassword,
	getUserDetails,
	logoutUser
} = require('../controllers/authController');

const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logoutUser);

router.route('/me').get(isAuthenticatedUser, getUserDetails);

module.exports = router;