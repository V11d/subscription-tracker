import status from "http-status"
import mongoose from "mongoose"
import User from '../models/user_model.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { username, email, password } = req.body

        if (password.length < 6) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            })
        }

        // Check if a user already exists
        const existingUser = await User.findOne({ email })

        if(existingUser) {
            return res.status(status.CONFLICT).json({
                success: false,
                message: 'User already exists'
            })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const new_user = new User({ username, email, password: hashedPassword })

        await new_user.save({ session })

        const token = jwt.sign(
            { userId: new_user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        await session.commitTransaction()
        session.endSession()

        res.status(status.CREATED).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: {
                    id: new_user._id,
                    username: new_user.username,
                    email: new_user.email
                },
            }
        })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

export const login = async (req, res, next) => {

    try {
        const {email, password} = req.body
        // * Checking if user exists
        const user = await User.findOne({email})
        // * If user doesn't exist
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // * Checking if password is correct
        const is_password_correct = await bcrypt.compare(password, user.password)

        // * If password is incorrect
        if (!is_password_correct) {
            return res.status(status.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // * Generating a jwt token
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )

        res.status(status.OK).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        })
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res) => {}