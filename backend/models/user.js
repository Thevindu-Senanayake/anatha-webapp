const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter your name.'],
		maxLength: [30, 'Your name cannot be longer than 30 characters.']
	},
	email: {
		type: String,
		required: [true, 'Please enter your email address'],
		unique: true,
		validate: [validator.isEmail, 'Please enter a valid email address.']
	},
	password: {
		type: String,
		required: [true, 'Please enter your password'],
		minLength: [6, 'Your password cannot be longer than 6 characters.'],
		select: false,

	},
	role: {
		type: String,
		defualt: 'user',
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	resetPasswordToken: String,
	resetPasswordExpiresAt: Date
})

module.exports = mongoose.model('User', userSchema);