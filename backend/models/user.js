const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
		defualt: 'user',
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

// Return JSON Web Token
userSchema.methods.getJwt = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_TIME
	});
}

module.exports = mongoose.model('User', userSchema);