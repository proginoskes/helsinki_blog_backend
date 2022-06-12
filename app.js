const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')

const blogsRouter = require('./controllers/blogs')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to mongoDB')
    })
    .catch(() => {
        logger.error('unable to connect to mongoDB')
    })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app