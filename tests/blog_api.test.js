const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const listHelper = require('../utils/list_helper')

const Blog = require('../models/blog')

const api = supertest(app)

describe('get requests', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(listHelper.initialBlogs)
    })
    test('blogs return correct status code', async () => {
        const response = await api.get('/api/blogs')
        expect(response.statusCode).toBe(200)
    })
    test('blogs return as json', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(listHelper.initialBlogs.length)
    })
    test('blogs are returned with \'id\' alias on identifier', async () => {
        const response = await api.get('/api/blogs')
        expect(Object.keys(response.body[0])).toContain('id')
    })    
})

describe('post requests', () => {
    beforeAll(async () => {
        await Blog.deleteMany({})
    })

    test('posting a single blog increases the number of posts', async () => {
        const orig_response = await api.get('/api/blogs')
        const post_response = await api.post('/api/blogs')
            .send(listHelper.initialBlogs[0])
        const final_response = await api.get('/api/blogs')
        expect(orig_response.body).toHaveLength(0)
        expect(final_response.body).toHaveLength(1)
    })

    test('posting a single blog correctly inserts all valid fields of a new blog', async () => {
        const post_response = await api.post('/api/blogs')
            .send(listHelper.initialBlogs[1])
        const valid_post = {...listHelper.initialBlogs[1], id: post_response.body.id}
        expect(post_response.body).toStrictEqual(valid_post)
    })

    test('posting a blog with no likes defined returns zero likes', async () => {
        const post_response = await api.post('/api/blogs')
            .send(listHelper.initialBlogs[4])
        expect(post_response.body.likes).toEqual(0)
    })

    test('posting a blog allows us to get the posted blog by id', async () => {
        const post_response = await api.post('/api/blogs')
            .send(listHelper.initialBlogs[4])
        const final_response = await api.get(`/api/blogs/${post_response.body.id}`)
        expect(post_response.body).toStrictEqual(final_response.body)
    })

    test('posting a blog without title or author returns 400 error', async () => {
        const post_response = await api.post('/api/blogs')
            .send({})
        expect(post_response.statusCode).toBe(400)
    })
        
    afterAll(() => {
        mongoose.connection.close()
    })    
})