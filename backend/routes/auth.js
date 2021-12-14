const express = require('express');
const router = express.Router();

const {
	registerUser,
	loginUser,
	forgotPassword,
	resetPassword,
	getUserDetails,
	updatePassword,
	updateUserDetails,
	logoutUser
} = require('../controllers/authController');

const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/logout').get(logoutUser);

router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/me/update').put(isAuthenticatedUser, updateUserDetails);

module.exports = router;