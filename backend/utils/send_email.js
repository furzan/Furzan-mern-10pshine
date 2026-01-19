const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  
  
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use true for port 465, false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send an email using async/await
  (async () => {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html, 
    });

    console.log("Message sent:", info.messageId);
  })();


};

module.exports = sendEmail;