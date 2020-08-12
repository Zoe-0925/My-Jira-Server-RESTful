const express = require('express')
const app = express()
const supertest = require('supertest')
const request = supertest(app)

it('Gets the test endpoint', async done => {
    // Sends GET Request to /test endpoint
    const response = await request.get('/api/users/')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('pass!')
    done()
})