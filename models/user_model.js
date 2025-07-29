import mongoose from "mongoose"

const user_schema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minLength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Email is required'],
        minLength: [11, 'Email must be at least 11 characters long'],
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters long']
    }
}, {timestamps: true})

const User = mongoose.model('User', user_schema)

export default User