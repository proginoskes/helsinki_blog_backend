const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')

// middleware
const errorHandler = require('./utils/middleware/error-handler')
const requestLogger = require('./utils/middleware/request-logger')
const jwtValidator = require('./utils/middleware/jwt-validator')
const unknownEndpoint = require('./utils/middleware/unknown-req')

const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to mongoDB')
    })
    .catch(() => {
        logger.error('unable to connect to mongoDB')
    })

app.use(cors())
app.use(express.json())

app.use(requestLogger())

app.use('/api/users', usersRouter)
app.use('/api/blogs', jwtValidator(), blogsRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler())
app.use(unknownEndpoint())

module.exports = app