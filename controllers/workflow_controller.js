import { create_require } from 'module'
const require = create_require(import.meta.url)
const { serve } = require('@upstash/workflow/express')
import Subscription from '../models/subscription_model.js'
import dayjs from 'dayjs'

const reminder_days = [7, 5, 3, 1]

export const send_reminders = serve(async (context) => {

    const { subscriptionId } = context.requestPayload
    const subscription = await fetch_subscription(context, subscriptionId)
    // * If no subscription or subscription is not active, return
    if (!subscription || subscription.status !== 'active') return
    // * If the renewal date is near then send the reminder
    const renewal_date = dayjs(subscription.renewal_date)
    if (renewal_date.isBefore(dayjs())) {
        console.log(`Renewal date for subscription ${subscriptionId} is in the past.`)
        return
    }
    for (const days of reminder_days) {
        const reminder_date = renewal_date.subtract(days, 'day')
        if (reminder_date.isAfter(dayjs())) {
            await sleep_until_reminder(context, `subscription:${subscriptionId}:reminder:${days}`, reminder_date)
        }
        await trigger_reminder(context, `subscription:${subscriptionId}:reminder:${days}`)
    }
})

const fetch_subscription = async (context, subscriptionId) => {

    return await context.run('get subscription', () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email')
    })
}

const sleep_until_reminder = async (context, label, date) => {

    console.log(`Sleeping until ${date.toISOString()} for label: ${label}`)
    await context.sleepUntil(label, date.toDate())
}

const trigger_reminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering reminder for label: ${label}`)
        // * Send email
    })
}