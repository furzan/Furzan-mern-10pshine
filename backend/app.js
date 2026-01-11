const express = require('express')
const db = require('./models')
const auth_router = require('./modules/auth/auth_routes')
const note_router = require('./modules/notes/note_routes')


const app = express()
app.use(express.json())

app.use('/api/auth', auth_router)

app.use('/api/notes', note_router)

const startserver = async()=>{

    try {

        await db.sequelize.authenticate();
        console.log('✅ Database connected.')

        await db.sequelize.sync({ alter: true })

        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`)
        })

    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1)
    }

}

startserver()
