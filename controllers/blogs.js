const blogsRouter = require('express').Router()

const User = require('../models/user')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', {username: 1, name: 1})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const blog = await Blog
        .findById(id)
        .populate('user', {username: 1, name: 1})
    response.json(blog.toJSON())
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    // check that blog doesn't already exist
    const check_exists = await Blog
        .findOne({title: body.title, author: body.author})
    if(check_exists){
        return response.status(400).json({error: 'blog already exists'})
    }

    if(!response.locals.userId){
        return response.status(401).json({error: 'invalid token'})
    }

    const user = await User.findById(response.locals.userId)


    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: response.locals.userId
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    return response.status(201).json(savedBlog).end()

})

blogsRouter.delete('/:id', async (request, response, next) => {
    const id=request.params.id
    const blog = await Blog.findByIdAndRemove(id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next)=>{
    const { title, author, url, likes } = request.body

    const updatedBlog = await Blog
        .findByIdAndUpdate(
            request.params.id, 
            { title, author, url, likes }, 
            { new: true, runValidators: true, context: 'query'}
        )
    if(updatedBlog){    
        response.json(updatedBlog)
    }else{
        response.status(404).end()
    }
})

module.exports = blogsRouter