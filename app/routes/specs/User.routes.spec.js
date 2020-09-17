require("regenerator-runtime/runtime");
const server = require('../../../index')
const request = require('supertest')
const bcrypt = require("bcrypt")
const BCRYPT_SALT_ROUNDS = 12

describe("User Routes", () => {
    it('let a valid user log in and returns an authentication access token', async (done) => {
        const hashedPassword = await bcrypt.hash('11111111', BCRYPT_SALT_ROUNDS);
        return request(server)
            .post('/api/users/login')
            .field('email', 'white_star@gmail.com')
            .field('password', '11111111')
            .expect((res) => {
                res.body.email = 'white_star@gmail.com';
                res.body.password = hashedPassword;
            })
            .expect(200, done);
    });

});



//                .set('Authorization', 'Bearer ' + token)

//TODO wrong
test.skip("user login route does not allow unauthorized calls", done => {
    request(server)
        .post("/api/users/login")
        .expect(403, "forbidden");
});

test.skip("user login route does not allow unauthorized calls", done => {
    request(server)
        .post("/api/users/login")
        .expect(200, done);
});

test.skip("testing route works", done => {
    request(server)
        .post("/test")
        .type("form")
        .send({ item: "hey" })
        .then(() => {
            request(server)
                .get("/test")
                .expect({ array: ["hey"] }, done);
        });
});
