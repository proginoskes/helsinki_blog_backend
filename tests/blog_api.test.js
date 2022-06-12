const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const listHelper = require('../utils/list_helper')

const User = require('../models/user')
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
        await User.deleteMany({})
        await api.post('/api/users')
            .send({
                username: "testuser",
                name: "Test User",
                password: "testpassword"
            })
        const login_response = await api.post('/api/login')
            .send({
                username: "testuser",
                password: "testpassword"
            })
        test_token = login_response.body.token
    })

    test('posting a single blog increases the number of posts', async () => {
        const orig_response = await api.get('/api/blogs')
        const post_response = await api.post('/api/blogs')
            .set('Authorization', `bearer ${test_token}`)
            .send(listHelper.initialBlogs[0])
        const final_response = await api.get('/api/blogs')
        expect(orig_response.body).toHaveLength(0)
        expect(final_response.body).toHaveLength(1)
    })

    test('posting a single blog correctly inserts all valid fields of a new blog', async () => {
        const post_response = await api.post('/api/blogs')
            .set('Authorization', `bearer ${test_token}`)
            .send(listHelper.initialBlogs[1])
        const valid_post = {
            ...listHelper.initialBlogs[1],
            id: post_response.body.id,
            user: post_response.body.user
        }
        expect(post_response.body).toStrictEqual(valid_post)
    })

    test('posting a blog with no likes defined returns zero likes', async () => {
        const post_response = await api.post('/api/blogs')
            .set('Authorization', `bearer ${test_token}`)
            .send(listHelper.initialBlogs[4])
        expect(post_response.body.likes).toEqual(0)
    })

    test('posting a blog allows us to get the posted blog by id', async () => {
        const post_response = await api.post('/api/blogs')
            .set('Authorization', `bearer ${test_token}`)
            .send(listHelper.initialBlogs[4])
        const final_response = await api.get(`/api/blogs/${post_response.body.id}`)
        expect(post_response.body.author).toStrictEqual(final_response.body.author)
        expect(post_response.body.id).toStrictEqual(final_response.body.id)
        expect(post_response.body.likes).toStrictEqual(final_response.body.likes)
        expect(post_response.body.url).toStrictEqual(final_response.body.url)
        expect(post_response.body.user).toStrictEqual(final_response.body.user.id)
    })

    test('posting a blog without title or author returns 400 error', async () => {
        const post_response = await api.post('/api/blogs')
            .set('Authorization', `bearer ${test_token}`)
            .send({})
        expect(post_response.statusCode).toBe(400)
    })  
})

describe('delete requests', () => {
    beforeAll(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        await api.post('/api/users')
            .send({
                username: "testuser",
                name: "Test User",
                password: "testpassword"
            })
        const login_response = await api.post('/api/login')
            .send({
                username: "testuser",
                password: "testpassword"
            })
        test_userid = login_response.body.id
        test_token = login_response.body.token
    })
    beforeEach(async () => {
        await api.post('/api/blogs')
            .set('Authorization', `bearer ${test_token}`)
            .send({
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                user: test_userid
            })
    })
    test('deleting returns 204 No content', async () => {
        const response = await api.get('/api/blogs')
        const del_response = await api.delete(`/api/blogs/${response.body[0].id}`)
            .set('Authorization', `bearer ${test_token}`)
        expect(del_response.statusCode).toEqual(204)
    })
    test('deleting returns nothing in body', async () => {
        const response = await api.get('/api/blogs')
        const del_response = await api.delete(`/api/blogs/${response.body[0].id}`)
            .set('Authorization', `bearer ${test_token}`)
        expect(del_response.body).toEqual({})
    })
    test('deleting returns 401 when unauthorized', async () => {
        const response = await api.get('/api/blogs')
        const del_response = await api.delete(`/api/blogs/${response.body[0].id}`)
        expect(del_response.statusCode).toEqual(401)
    })
})

describe('update requests', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(listHelper.initialBlogs)
    })
    test('updating likes updates likes', async () => {
        const response = await api.get('/api/blogs')
        const update_response = await api.put(`/api/blogs/${response.body[0].id}`)
            .send({likes: 4444})
        expect(update_response.statusCode).toEqual(200)
        expect(update_response.body.likes).toEqual(4444)
    })
    test('updating url updates url', async () => {
        const response = await api.get('/api/blogs')
        const update_response = await api.put(`/api/blogs/${response.body[0].id}`)
            .send({url: 'crouton.net'})
        expect(update_response.body.url).toEqual('crouton.net')
    })
    test('updating author updates author', async () => {
        const response = await api.get('/api/blogs')
        const update_response = await api.put(`/api/blogs/${response.body[0].id}`)
            .send({author: 'George III'})
        expect(update_response.body.author).toEqual('George III')
    })
    test('updating title updates title', async () => {
        const response = await api.get('/api/blogs')
        const update_response = await api.put(`/api/blogs/${response.body[0].id}`)
            .send({title: 'Borange'})
        expect(update_response.body.title).toEqual('Borange')
    })
})

afterAll(() => {
    mongoose.connection.close()
})  