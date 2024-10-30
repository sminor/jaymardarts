const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Parse the form data
  const { email, subject, message } = JSON.parse(event.body);

  // Nodemailer configuration (using your SMTP credentials)
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use any SMTP service
    auth: {
      user: process.env.SMTP_USER, // Your Gmail or SMTP user
      pass: process.env.SMTP_PASS, // Your Gmail or SMTP password
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.SMTP_USER, // Your email address
    replyTo: email, // Set the reply-to to the user's email
    to: process.env.SMTP_USER, // Your receiving email address
    subject, // Email subject
    text: message, // Plain text body directly from the message without extra new lines
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.log('Error occurred while sending email:', error); // Log the full error object  
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email', error: error.toString() }),
    };
  }
};

