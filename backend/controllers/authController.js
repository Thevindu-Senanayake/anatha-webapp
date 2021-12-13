const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/JsonWebToken');
const sendEmail = require('../utils/sendEmail');

// Register a user  => /api/v1/register
exports.registerUser = catchAsyncErrors (async (req, res, next) => {

	const { name, email, password } = req.body;

	const user = await User.create({
		name,
		email,
		password
	});

	sendToken(user, 200, res);

})

// Login User  =>	/api/v1/login
exports.loginUser = catchAsyncErrors (async (req, res, next) => {

	const { email, password } = req.body;

	// Checks if email and password is entered by user
	if(!email || !password) {
		return next(new ErrorHandler('Please enter email & password', 400));
	}

	// Finding user in database
	const user = await User.findOne({ email }).select('+password');

	if(!user) {
		return next(new ErrorHandler('Invalid Email or Password', 401));
	}

	// Checks if password is correct or not
	const isPasswordMatched = await user.comparePassword(password);

	if(!isPasswordMatched) {
		return next(new ErrorHandler('your password does not match', 401));
	}

	sendToken(user, 200, res);

})

// Forgot Password	=> /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors (async (req, res, next) => {

	const user = await User.findOne({ email: req.body.email });

	if(!user) {
		return next(new ErrorHandler('User not found with this email', 404));
	}

	// Get reset token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false});

	// Create reset password url
	const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

	const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

	try {

		await sendEmail({
			email: user.email,
			subject: 'Password Recovery',
			message
		})

		res.status(200).json({
			success: true,
			message: `Email has been sent to ${user.email}`
		})

	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;

		await user.save({ validateBeforeSave: false});

		return next(new ErrorHandler(error.message, 500));
	}
})

// Logout user  => /api/v1/logout
exports.logoutUser = catchAsyncErrors ( async (req, res, next) => {

	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true
	})

	res.status(200).json({
		success: true,
		message: 'You have logged out'
	})
})