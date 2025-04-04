const nodemailer = require("nodemailer");

const senderMail = process.env.NODEMAILER_EMAIL;

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: senderMail,
        pass: process.env.NODEMAILER_PASS,
    }
});


const sendAccountDeletionEmail = async (userData) => {
    const {
        firstN,
        lastN,
        email
    } = userData;

    const deletionUrl = `https://www.sharp-pay.com.ng/deleteAccount?email=${encodeURIComponent(email)}`;  // URL for account deletion

    const textContent = `
    Hi ${firstN} ${lastN},

    We have received a request to delete your Sharppay account. If you wish to proceed with the deletion of your account and all associated data, please click the link below:

    Delete My Account: ${deletionUrl}

    If you did not request this action, please ignore this message, and your account will remain active.

    Regards,
    Sharppay Team
    `;

    const htmlContent = `
    <div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #555;">Hi ${firstN} ${lastN},</h2>
            <p>We have received a request to delete your Sharppay account. If you wish to proceed with the deletion of your account and all associated data, please click the button below:</p>
            <a href="${deletionUrl}" style="display: inline-block; padding: 10px 20px; background-color: #e74c3c; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 10px 0;">Delete My Account</a>
            <p>If you did not request this action, please ignore this message, and your account will remain active.</p>
            <p style="color: #555;">Regards,<br/>Sharppay Team</p>
        </div>
        <footer style="text-align: center; margin-top: 20px; color: #888;">
            <p>Sharppay, All rights reserved.</p>
        </footer>
    </div>
    `;

    return new Promise(function (res, rej) {
        transport.sendMail({
            from: senderMail,
            to: email,
            subject: "Delete Your Sharppay Account",
            text: textContent,
            html: htmlContent
        }, (error, info) => {
            if (error)
                rej(error);
            res(info);
        });
    });
};

const mailOtp = async (user) => {
    const { firstN, lastN, otp, email } = user;
    // Email content
    
    const mailMes = `
        <h1>Welcome to SharpPay</h1>
        <p>Hello ${firstN} ${lastN},</p>
        <p>Your verification code is <b>${otp}</b></p>
    `;

    // Plain text version of the email (optional)
    const textContent = `Hello ${firstN} ${lastN},\nYour verification code is ${otp}`;

    // Send mail using transporter
    return new Promise(function (resolve, reject) {
        transport.sendMail({
            from: `"SharpPay Test" <${senderMail}>`,
            to: email,
            subject: "Account Verification",
            text: textContent, // Optional plain-text version of the message
            html: mailMes // HTML version of the message
        }, (error, info) => {
            if (error) {
                console.log("Error sending mail:", error);
                return reject(error); // Return the error if mail sending fails
            }
            console.log("Mail sent successfully!", info.response);
            resolve(info); // Resolve the promise if mail sending is successful
        });
    });

};


module.exports = {
   sendAccountDeletionEmail,
   mailOtp
}
// Example usage
