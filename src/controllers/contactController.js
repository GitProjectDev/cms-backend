const transporter = require('../config/mail');

exports.sendContactMail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    
    const mailOptions = {
      from: process.env.MAIL_FROM || 'no-reply@example.com',
      replyTo: email,
      to: process.env.CONTACT_EMAIL,
      subject: `Contact Us Message from ${name}`,
      text: `New Contact Message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (error) {
    console.error('Mail Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message. Try again later.',
    });
  }
};
