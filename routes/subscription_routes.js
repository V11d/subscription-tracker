import express from "express"
import { 
    cancel_subscription,
    create_subscription,
    delete_subscription,
    get_all_subscriptions,
    get_subscription_by_id,
    get_user_subscriptions,
    update_subscription
} from "../controllers/subscription_controller.js"
import { auth_middleware, admin_middleware } from "../middlewares/auth_middlewares.js"

const subscription_routes = express.Router()

// * User route that can conflict with admin routes
subscription_routes.get('/user/:id', auth_middleware, get_user_subscriptions)

// * Admin routes
subscription_routes.get('/', admin_middleware, get_all_subscriptions)
subscription_routes.get('/:id', admin_middleware, get_subscription_by_id)

// * User related routes
subscription_routes.post('/', auth_middleware, create_subscription)
subscription_routes.put('/:id', auth_middleware, update_subscription)
subscription_routes.delete('/:id', auth_middleware, delete_subscription)

// * To cancel the subscription
subscription_routes.put('/:id/cancel', auth_middleware, cancel_subscription)

export default subscription_routes