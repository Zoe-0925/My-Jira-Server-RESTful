const request = require('supertest')
const app = require('../../../index')

const order =
{
    customerFName: "fName",
    customerLName: "lName",
    customerEmail: "email",
    shippingAddress: "test address",
    shippingSuburb: "test",
    shippingPostcode: "3000",
    shippingState: "VIC",
    shippingCountry: "AU",
    paidDateTime: "2020-01-01T23:28:56.782Z", //date time},
    paymentMethod: "Paypal",
    total: 100,
    currency: "AUD",
}


describe('Post Order Endpoints', () => {
    it('should create a new Order', async () => {
        const res = await request(app)
            .post('/api/orders')
            .send(order)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('post')
    })
})