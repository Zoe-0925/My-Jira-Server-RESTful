
const mongoose = require('mongoose');
const db = require("../index");
const User = db.users
require("regenerator-runtime/runtime");

describe.skip('Users', () => {
    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/my_database`
        await mongoose.connect(url, { useNewUrlParser: true })
    })

    afterAll(done => {
        return done();
    });

    describe('CREATE', () => {
        test('can create a user', async () => {
            var id = mongoose.Types.ObjectId();
            await new User({
                _id: id,
                name: 'Sol',
                email: 'white_star@gmail.com',
                password: "11111111"
            }).save();
            const user = await User.findOne({ name: 'Sol' });

            expect(user.name).toEqual('Sol');
        });
    });

    describe('READ', () => {
        let users;

        test('target user can find be found by email', async () => {
            const targetUser = await User.findOne({ email: 'white_star@gmail.com' })
            expect(targetUser.name).toEqual('Sol');
        });
    });
    describe('DELETE', () => {
        let systems;
    });
});

/**
 *
 * A worker process has failed to exit gracefully and has been force exited.
 * This is likely caused by tests leaking due to improper teardown.
 * Try running with --runInBand --detectOpenHandles to find leaks.
 */