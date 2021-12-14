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
	logoutUser,
	allUsers,
	getSingleUserDetails
} = require('../controllers/authController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/logout').get(logoutUser);

router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/me/update').put(isAuthenticatedUser, updateUserDetails);

router.route('/admin/allusers').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUserDetails)

module.exports = router;