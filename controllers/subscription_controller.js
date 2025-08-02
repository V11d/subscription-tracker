import status from "http-status"
import Subscription from '../models/subscription_model.js'

export const get_all_subscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find()
        res.status(status.OK).json({
            success: true,
            data: subscriptions
        })
    } catch (error) {
        next(error)
    }
}

export const get_subscription_by_id = async (req, res, next) => {

    try {
        const subscription = await Subscription.findById(req.params.id)
        if (!subscription) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: 'Subscription not found'
            })
        }
        res.status(status.OK).json({
            success: true,
            data: subscription
        })
    } catch (error) {
        next(error)
    }
}

export const create_subscription = async (req, res, next) => {

    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        })
        // * Returning the created subscription
        res.status(status.CREATED).json({
            success: true,
            data: subscription
        })
    } catch (error) {
        next(error)
    }
}

export const get_user_subscriptions = async (req, res, next) => {

    try {
        // * Checking if the user is same as the one making the request
        if (req.user.id !== req.params.id) {
            return res.status(status.FORBIDDEN).json({
                success: false,
                message: 'You are not the owner of these subscriptions'
            })
        }
        const subscriptions = await Subscription.find({ user: req.params.id })
        res.status(status.OK).json({
            success: true,
            data: subscriptions
        })
    } catch (error) {
        next(error)
    }
}

export const update_subscription = async (req, res, next) => {

    try {
        const { id } = req.params
        const updated_data = req.body
        const subscription = await Subscription.findByIdAndUpdate(
            id,
            updated_data,
            { new: true, runValidators: true }
        )
        if (!subscription) {
        return res.status(status.NOT_FOUND).json({
                success: false,
                message: 'Subscription not found'
            })
        }
        res.status(status.OK).json({
            success: true,
            data: subscription
        })
    } catch (error) {
        next(error)
    }
}

export const cancel_subscription = async (req, res, next) => {

    try {
        const { id } = req.params
        const userId = req.user._id

        const subscription = await Subscription.findOne({ _id: id, user: userId })
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' })
        }

        if (subscription.status === 'cancelled') {
            return res.status(400).json({ message: 'Subscription is already cancelled' })
        }

        subscription.status = 'cancelled'
        await subscription.save()

        return res.status(200).json({
            message: 'Subscription cancelled successfully',
            subscription
        })
    } catch (error) {
        next(error)
    }
}

export const delete_subscription = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const subscription = await Subscription.findOneAndDelete({ _id: id, user: userId })

        if (!subscription) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: 'Subscription not found or already deleted'
            })
        }

        res.status(status.OK).json({
            success: true,
            message: 'Subscription deleted successfully'
        })
    } catch (error) {
        next(error)
    }
}