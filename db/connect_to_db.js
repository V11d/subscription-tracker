import mongoose from 'mongoose'

const connect_to_db = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected to ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error connecting to database: ${error.message}`)
        process.exit(1) // Exit the process with failure
    }
}

export default connect_to_db