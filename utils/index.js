const sendVerificationEmail = require('./sendVerificationEmail')
const sendPasswordResetEmail = require('./sendPasswordResetEmail')
const generateEmailTemplate = require('./generateEmailTemplate')
module.exports = {
	sendVerificationEmail,
	sendPasswordResetEmail,
	generateEmailTemplate,
}
