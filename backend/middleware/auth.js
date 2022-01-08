const jwt = require("jsonwebtoken")

// Token validation
exports.authUser = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split("Bearer ")[1]
        if (token) {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY)
                req.user = user
                return next()
            } catch (err) {
                return res.json({ authEx: true, errors: { message: "Your login session has expired!" } })
            }
        }
        return res.json({ errors: { message: "Authorization token must be Bearer [token]" } })
    }
    return res.json({ errors: { message: "Authorization header must be provided!" } })
}

// User role validation
exports.authRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.userType
        if (roles.includes(userRole)) {
            next()
        }
        else {
            return res.status(401).json({ errors: { message: "You don't have permission!" } })
        }
    }
}