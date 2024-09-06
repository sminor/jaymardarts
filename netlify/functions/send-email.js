const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Parse the form data
  const { name, email, subject, message } = JSON.parse(event.body);

  // Nodemailer configuration (you'll need to set up SMTP credentials)
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Example: Gmail, but you can use any SMTP service
    auth: {
      user: process.env.SMTP_USER, // Your SMTP user from Netlify environment variables
      pass: process.env.SMTP_PASS, // Your SMTP password
    },
  });

  // Email options
  const mailOptions = {
    from: email, // sender address
    to: 'steven.minor@gmail.com', // your email address
    subject: `New message from ${name}: ${subject}`, // subject line
    text: message, // plain text body
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email', error }),
    };
  }
};
