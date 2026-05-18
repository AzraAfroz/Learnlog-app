const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('Sending email...', process.env.EMAIL_USER,
    process.env.EMAIL_PASS);
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });




  const message = {
    from: `${process.env.FROM_NAME || 'LearnLog'} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};


module.exports = sendEmail;
