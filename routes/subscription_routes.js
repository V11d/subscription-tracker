import express from "express"

const subscription_routes = express.Router()

subscription_routes.get('/', (req, res) => {
    res.send('Fetch all subscriptions')
})

subscription_routes.get('/:id', (req, res) => {
    res.send(`Fetch subscription with ID: ${req.params.id}`)
})

subscription_routes.post('/', (req, res) => {
    res.send('Create new subscription')
})

subscription_routes.put('/:id', (req, res) => {
    res.send(`Update subscription with ID: ${req.params.id}`)
})

subscription_routes.delete('/:id', (req, res) => {
    res.send(`Delete subscription with ID: ${req.params.id}`)
})

// All subscriptions by a specific user
subscription_routes.get('/user/:id', (req, res) => {
    res.send(`Fetch subscriptions for user ID: ${req.params.id}`)
})

// Cancel a subscription
subscription_routes.put('/:id/cancel', (req, res) => {
    res.send(`Cancel subscription with ID: ${req.params.id}`)
})

// Check renewal dates
subscription_routes.get('/upcoming-renewals', (req, res) => {
    res.send('Check upcoming renewal dates')
})

export default subscription_routes