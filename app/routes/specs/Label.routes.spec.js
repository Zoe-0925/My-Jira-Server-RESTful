require("regenerator-runtime/runtime");
const request = require("supertest");
const server = require('../../../index')

test.skip("label route works", done => {
    request(server)
        .get("/api/labels/")
        .expect(200, done);
});
