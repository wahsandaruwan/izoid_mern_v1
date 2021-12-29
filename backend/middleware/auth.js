const jwt = require("jsonwebtoken")

// Token validation
exports.authUser = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split("Bearer ")[1]
        if (token) {
            try {
                jwt.verify(token, process.env.SECRET_KEY)
                return next()
            } catch (err) {
                return res.json({ authEx: true, errors: { message: "Your login session has expired!" } })
            }
        }
        return res.json({ errors: { message: "Authorization token must be Bearer [token]" } })
    }
    return res.json({ errors: { message: "Authorization header must be provided!" } })
}