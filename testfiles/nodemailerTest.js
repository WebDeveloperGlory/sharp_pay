const nodemailer = require("nodemailer");
require("dotenv").config();

// Replace with your details
const senderMail = process.env.NODEMAILER_EMAIL; 
const appPassword = process.env.NODEMAILER_PASS; // 16-character App Password

console.log("Email:", senderMail);
console.log("Password:", appPassword);

// Configure transporter
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: senderMail,
        pass: appPassword
    }
});

// Define email options
const mailOptions = {
    from: `"SharpPay Test" <${senderMail}>`, // Sender
    to: "gloryumuerri223@gmail.com", // Replace with recipient's email
    subject: "Test Email from Node.js",
    text: "Hello! This is a test email sent using Nodemailer.",
    html: "<h3>Hello!</h3><p>This is a <b>test email</b> sent using <i>Nodemailer</i>.</p>"
};

// Send email
transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending email:", error);
    } else {
        console.log("Email sent successfully!", info.response);
    }
});
