import status from "http-status"
import jwt from 'jsonwebtoken'
import User from "../models/user_model.js"

export const auth_middleware = async (req, res, next) => {

    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        // * Checking if token is valid
        if (!token) {
            return res.status(status.UNAUTHORIZED).json({
                message: 'No token provided, authorization denied'
            })
        }
        // * Verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select('-password')
        // * Checking if user exists
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({
                message: 'User not found, authorization denied'
            })
        }
        req.user = user
        next()
    } catch (error) {
        res.status(status.UNAUTHORIZED).json({
            message: 'Unauthorized access',
            error: error.message
        })
    }
}

export const admin_middleware = async (req, res, next) => {

    try {
        let token
        if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({
                message: 'No token provided, authorization denied'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId || decoded.id).select('-password')

        if (!user || !user.is_admin) {
            return res.status(403).json({
                message: 'Admin access only'
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized access',
            error: error.message
        })
    }
}