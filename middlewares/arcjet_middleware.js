import aj from "../config/arcjet.js"
import status from "http-status"

export const arcjet_middleware = async (req, res, next) => {

    try {
        const decision = await aj.protect(req, {requested: 1})

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(status.TOO_MANY_REQUESTS).json({
                    success: false,
                    error: 'Rate limit exceeded'
                })
            }
            // * If forbidden
            if (decision.reason.isBot()) {
                return res.status(status.FORBIDDEN).json({
                    success: false,
                    error: 'Bot detected'
                })
            }
            
            return res.status(status.FORBIDDEN).json({
                success: false,
                error: 'Access denied'
            })
        }
        next()
    } catch (error) {
        console.log(`Arcjet middleware error: ${error.message}`)
        next(error)
    }
}

export default arcjet_middleware