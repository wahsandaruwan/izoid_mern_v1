const nodemailer = require("nodemailer")
const { google } = require("googleapis")

// Authenticate
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

// Email sending
exports.sendEmail = async (email, regNum, subject, password) => {
    try {
        // Generate access token
        const accessToken = await oAuth2Client.getAccessToken()
        // console.log(accessToken)

        // Transporter object
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: false,
            port: 25,
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        // Send mail
        await transporter.sendMail({
            from: `Izoid Education Center ${process.env.EMAIL}`,
            to: email,
            subject: subject,
            text: `Here is your credentials, Registration Code : ${regNum} | Password : ${password}`,
            html: `<h2>${subject}</h2><br><h3>Here is your credentials...</h3><br><b>Registration Code : ${regNum}</b><br><b>Password : ${password}</b>`
        })
    } catch (err) {
        console.log(err.message)
    }
}
