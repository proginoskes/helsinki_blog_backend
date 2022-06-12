const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id)
    response.json(blog.toJSON())
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    console.log(body)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })
    const savedBlog = await blog.save()

    return response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response, next) => {
    const id=request.params.id
    const blog = await Blog.findByIdAndRemove(id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next)=>{
    const { content, important } = request.body

    const updatedBlog = await Blog
        .findByIdAndUpdate(
            request.params.id, 
            { content, important }, 
            { new: true, runValidators: true, context: 'query'}
        )
    if(updatedBlog){    
        response.json(updatedBlog)
    }else{
        response.status(404).end()
    }
})

module.exports = blogsRouter