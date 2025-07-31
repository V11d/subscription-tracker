import status from "http-status"

const error_middleware = (err, req, res, next) => {
    console.error(err)

    let error = {
        statusCode: err.statusCode || status.INTERNAL_SERVER_ERROR,
        message: err.message || 'Server Error'
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error.message = 'Resource not found'
        error.statusCode = status.NOT_FOUND
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        error.message = `Duplicate value entered for field: ${field}`
        error.statusCode = status.BAD_REQUEST
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message)
        error.message = messages.join(', ')
        error.statusCode = status.BAD_REQUEST
    }

    res.status(error.statusCode).json({
        success: false,
        error: error.message
    })
}

export default error_middleware