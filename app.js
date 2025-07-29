import express from 'express'
import dotenv from 'dotenv'
import auth_routes from './routes/auth_roues.js'
import user_routes from './routes/user_routes.js'
import subscription_routes from './routes/subscription_routes.js'
import connect_to_db from './db/connect_to_db.js'

dotenv.config()

const port = process.env.PORT
const app = express()

app.use('/api/v1/auth', auth_routes)
app.use('/api/v1/users', user_routes)
app.use('/api/v1/subscriptions', subscription_routes)

app.listen(port, async () => {

    console.log(`Server listening on port ${port}`)
    await connect_to_db()
})