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
            const error = new Error('Password must be at least 6 characters long')
            error.statusCode = status.BAD_REQUEST
            throw error
        }

        // Check if a user already exists
        const existingUser = await User.findOne({ email })

        if(existingUser) {
            const error = new Error('User already exists')
            error.statusCode = status.CONFLICT
            throw error
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ username, email, password: hashedPassword })

        await newUser.save({ session })

        const token = jwt.sign(
            { userId: newUser._id },
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
                user: newUser,
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
            const error = new Error('User not found')
            error.statusCode = status.NOT_FOUND
            throw error
        }

        // * Checking if password is correct
        const is_password_correct = await bcrypt.compare(password, user.password)

        // * If password is incorrect
        if (!is_password_correct) {
            const error = new Error('Incorrect password')
            error.statusCode = status.UNAUTHORIZED
            throw error
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