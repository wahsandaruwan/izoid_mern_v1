const nodemailer = require('nodemailer')

// Transporter object
const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
})

// Email sending
exports.sendEmail = async (email, regNum, subject, password) => {
    try {
        await transporter.sendMail({
            from: `Izoid Education Center ${process.env.EMAIL}`,
            to: email,
            subject: subject,
            html: `<h2>${subject}</h2><br><h3>Here is your credentials...</h3><br><b>Registration Number : ${regNum}</b><br><b>Password : ${password}</b>`
        });
    } catch (err) {
        console.log(err.message)
    }
}
