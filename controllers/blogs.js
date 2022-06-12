const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.get('/:id', (request, response) => {
    const id = request.params.id
    Blog
        .find({ id })
        .then(blogs => {
            response.json(blogs[0])
        })
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

blogsRouter.post('/:id', (request, response) => {
    console.log(`posting: ${request.body}`)
    response.status(404).end()
})

blogsRouter.delete('/:id', (request, response) => {
    console.log(`deleting: ${request.path}`)
    response.status(204).end()
})

module.exports = blogsRouter