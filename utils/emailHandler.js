const nodemailer = require('nodemailer')

const sendEmail = async ({ to, subject, html }) => {
	// const transporter = nodemailer.createTransport({
	// 	host: 'smtp.zoho.com',
	// 	port: 465,
	// 	secure: true,
	// 	auth: {
	// 		user: process.env.MAIL_USERNAME,
	// 		pass: process.env.MAIL_PASSWORD,
	// 	},
	// })
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',
		port: 587,
		auth: {
			user: process.env.MAIL_USERNAME,
			pass: process.env.MAIL_PASSWORD,
		},
	});

	return transporter.sendMail({
	
		from: '"Jobify - The Job Tracking Web App" <anmolnag576@gmail.com>',
		to,
		subject,
		html,
	},(err, info) => {
        if (err) {
            console.log('Error occurred. from mail ' + err.message);
            // return process.exit(1);
        }
		// else		console.log('Message sent: %s', info.messageId,info);
	})
	
}

module.exports = sendEmail
