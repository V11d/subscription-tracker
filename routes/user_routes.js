import express from 'express'
import { auth_middleware } from '../middlewares/auth_middlewares.js'
import { get_all_users, get_user } from '../controllers/user_controller.js'

const user_routes = express.Router()

user_routes.get('/', get_all_users)

user_routes.get('/:id', auth_middleware, get_user)

user_routes.post('/', (req, res) => {
  res.send('Creating a new user')
})

user_routes.put('/:id', (req, res) => {
  res.send(`Updating user with ID: ${req.params.id}`)
})

user_routes.delete('/:id', (req, res) => {
  res.send(`Deleting user with ID: ${req.params.id}`)
})

export default user_routes