import status from "http-status"
import User from "../models/user_model.js"

export const get_all_users = async (req, res, next) => {

    try {
        const users = await User.find()
        res.status(status.OK).json({
            success: true,
            message: 'Users fetched successfully',
            data: users
        })
    } catch (error) {
        next(error)
    }
}

export const get_user = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            })
        }
        res.status(status.OK).json({
            success: true,
            message: 'User fetched successfully',
            data: user
        })
    } catch (error) {
        next(error)
    }
}

// export const 