const jwt = require ('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

const getTokenFrom = request =>{
    const authorization = request.get('Authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7)
    }
    return null
}


describe('user creation', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })
    test('returns status code 201', async () => {
        const post_response = await api.post('/api/users')
            .send({
                username: "testuser",
                name: "Test User",
                password: "testpassword"
            })
        expect(post_response.statusCode).toEqual(201)
    })
})