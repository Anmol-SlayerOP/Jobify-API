const sendEmail = require('./emailHandler')
const generateEmailTemplate = require('./generateEmailTemplate')

const sendVerificationEmail = async ({
	name,
	email,
	verificationToken,
	origin,
}) => {
	const frontendEmailVerificationLink = `${origin}/auth/verify-email?token=${verificationToken}&email=${email}`
	const html = generateEmailTemplate({
		name,
		description:
			'Welcome to Jobify! Please click the button below to confirm your email.',
		link: frontendEmailVerificationLink,
		buttonLabel: 'Verify Email',
	})
	return sendEmail({
		to: email,
		subject: 'Email Verification',
		html,
	})
}

module.exports = sendVerificationEmail
