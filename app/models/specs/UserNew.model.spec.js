
const mongoose = require('mongoose');
const User = mongoose.model('User');

process.env.TEST_SUITE = 'spacetime-systems-test';

describe('Users', () => {
    describe('CREATE', () => {
        let users;

        test('can create a user', async () => {
            await new User({
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