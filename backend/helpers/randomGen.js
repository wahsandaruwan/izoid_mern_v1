const jwt = require("jsonwebtoken")

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
        id: user._id,
        regNum: user.regNum,
        email: user.email,
        userType: user.type
    }, process.env.SECRET_KEY, { expiresIn: '10h' })
}