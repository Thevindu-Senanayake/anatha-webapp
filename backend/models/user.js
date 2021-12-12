const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


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
		minlength: [6, 'Your password cannot be longer than 6 characters.'],
		select: false,

	},
	role: {
		type: String,
		default: 'user',
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	resetPasswordToken: String,
	resetPasswordExpiresAt: Date
})

// Encrypting password before saving user
userSchema.pre('save', async function (next) {
	if(!this.isModified('password')) {
		next()
	}

	this.password = await bcrypt.hash(this.password, 10)
})

// Compare user password
userSchema.methods.comparePassword = async function (enterdPassword) {
	return await bcrypt.compare(enterdPassword, this.password);
}

// Return JSON Web Token
userSchema.methods.getJwt = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_TIME
	});
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hash and set to resetPasswordToken
	this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	// Set token expire time
	this.resetPasswordExpiresAt = Date.now() + 30 * 60 * 1000;

	return resetToken;

}

module.exports = mongoose.model('User', userSchema);