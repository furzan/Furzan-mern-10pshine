const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or your preferred SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use an App Password if using Gmail
    },
  });

  const mailOptions = {
    from: `"Notes App Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;