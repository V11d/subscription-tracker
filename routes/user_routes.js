import express from 'express'

const user_routes = express.Router()

user_routes.get('/', (req, res) => {
  res.send('Fetching all users')
})

user_routes.get('/:id', (req, res) => {
  res.send(`Fetching user with ID: ${req.params.id}`)
})

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