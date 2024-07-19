const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide name.'],
		maxlength: [50, "Name can't be more than 50 characters."],
		minlength: [3, 'Name should have, at least, 3 characters.'],
	},
	email: {
		type: String,
		required: [true, 'Please provide email.'],
		match: [
			/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
			'Please provide valid email',
		],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide password.'],
		minlength: [3, 'Name should have, at least, 3 characters.'],
	},
	avatar: {
		type: String,
		default: '',
	},
	verificationToken: String,
	isVerified: {
		type: Boolean,
		default: false,
	},
	verifiedAt: Date,
	passwordToken: String,
	passwordTokenExpirationDate: Date,
	savedJobs: [{ type: Schema.Types.ObjectId, ref: 'UserJob' }],  // isme databasewali id save hogi
	importantJobs: [{ type: Schema.Types.ObjectId, ref: 'UserJob' }],
	appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'UserJob' }],
	createdJobs: [{ type: Schema.Types.ObjectId, ref: 'UserJob' }]
})

UserSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{ userID: this._id, name: this.name },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_LIFETIME,
		}
	)
}

UserSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password) // will return boolean
}
const User = mongoose.model('User', UserSchema);
module.exports = User;

