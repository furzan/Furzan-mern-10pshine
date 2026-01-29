const express = require('express')
const cors = require('cors');
const db = require('./models')
const auth_router = require('./modules/auth/auth_routes')
const note_router = require('./modules/notes/note_routes')
const logger = require('./utils/logger')
const httpLogger = require('./middleware/http_logger_middleware')
const { errorHandler, notFoundHandler } = require('./middleware/error_handler_middleware')




const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));

app.use(express.json())

app.use(httpLogger);

app.use('/api/auth', auth_router)

app.use('/api/notes', note_router)

app.use(notFoundHandler);

app.use(errorHandler);

const startserver = async()=>{

    try {

        await db.sequelize.authenticate();
        console.log('✅ Database connected.')

        // Only sync database if not in test environment
        if (process.env.NODE_ENV !== 'test') {
            await db.sequelize.sync()
        }

        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`);
        })

        process.on('unhandledRejection', (err) => {
            logger.error({ err }, 'UNHANDLED REJECTION! Shutting down...');
            process.exit(1);
        });

        process.on('uncaughtException', (err) => {
            logger.error({ err }, 'UNCAUGHT EXCEPTION! Shutting down...');
            process.exit(1);
        });

    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1)
    }

}

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    startserver()
}

module.exports = app;
