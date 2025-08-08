import express from "express"

const workflow_routes = express.Router()

workflow_routes.get('/', (req, res) => {
    res.send('Hello from the workflow routes!')
})

export default workflow_routes