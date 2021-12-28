const jwt = require("jsonwebtoken")
require("dotenv/config")

// Generate random registration number
exports.randomReg = (type) => {
    let date = new Date().valueOf()
    let random = Math.floor(date + Math.random() * 900000);
    let string = random.toString()
    let final = type.charAt(0) + string.slice(string.length - 6)
    return final
}

// Generate random jwt
exports.randomJWT = (user) => {
    return jwt.sign({
        id: user._id
    }, process.env.SECRET_KEY, { expiresIn: '1m' })
}