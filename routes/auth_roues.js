import express from 'express'

const auth_routes = express.Router()

auth_routes.post('/signup', async (req, res) => {

    // * Will be imported from the controller file
})

auth_routes.post('/login', async (req, res) => {

    // * Function will be imported from the controller file
})

auth_routes.post('/logout', (req, res) => {

    // * Function will be imported from the controller file
})

export default auth_routes