const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        // service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL, // generated ethereal user
            pass: process.env.SMTP_PASSWORD // generated ethereal password
        }
    });
    // send mail with defined transport object
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message // plain text body
    };
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
}

module.exports = sendEmail;
