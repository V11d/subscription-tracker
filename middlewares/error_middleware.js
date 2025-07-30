import status from "http-status"

const error_middleware = (err, req, res, next) => {
    try {
        let error = { ...err }

        error.message = err.message

        console.error(err)

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = 'Resource not found'
            error = new Error(message)
            error.statusCode = status.NOT_FOUND
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = '   Duplicate field value entered'
            error = new Error(message)
            error.statusCode = status.BAD_REQUEST
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message)
            error = new Error(message.join(', '))
            error.statusCode = status.BAD_REQUEST
        }

        res.status(error.statusCode || status.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error.message || 'Server Error'
        })
    } catch (error) {
        next(error)
    }
}

export default error_middleware