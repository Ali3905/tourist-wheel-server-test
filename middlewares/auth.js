const jwt = require("jsonwebtoken");
const {user} = require("../models/user");

async function handleGetUserByAuthToken(req, res, next) {
    try {
        const { authtoken } = req.headers
        if (!authtoken) {
            return res.status(400).json({
                success: false,
                message: "Login with correct creds"
            })
        }
        const data = jwt.verify(authtoken, process.env.JWT_SECRET)
        req.data = data
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const handleAuthorizeUserByRole = role => {

    return (req, res, next) => {
        try {
            const { authtoken } = req.headers
            if (!authtoken) {
                return res.status(400).json({
                    success: false,
                    message: "Login with correct creds"
                })
            }
            const data = jwt.verify(authtoken, process.env.JWT_SECRET)
            
            if (!role.includes(data.role)) {
                return res.status(400).json({
                    success: false,
                    message: "You are not authorize to perform this action"
                })
            }
            next()
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = {
    handleGetUserByAuthToken,
    handleAuthorizeUserByRole
}