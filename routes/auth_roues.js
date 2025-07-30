import express from 'express'
import { login, logout, signup } from '../controllers/auth_controller.js'

const auth_routes = express.Router()

auth_routes.post('/signup', signup)

auth_routes.post('/login', login)

auth_routes.post('/logout', logout)

export default auth_routes