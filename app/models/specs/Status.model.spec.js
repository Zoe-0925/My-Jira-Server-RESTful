
const mongoose = require('mongoose');
const db = require("../index");
const User = db.users
const Project = db.projects
const Status = db.status
require("regenerator-runtime/runtime");

//TODO delete

describe.skip('Status', () => {
    let userId = mongoose.Types.ObjectId()
    let projectId = mongoose.Types.ObjectId()
    let statusId = mongoose.Types.ObjectId()
    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/my_database`
        await mongoose.connect(url, { useNewUrlParser: true })
        await new User({
            _id: userId,
            email: "testEmailForComment@a.com",
            password: "11111111"
        }).save();
        await new Project({
            _id: userId,
            name: "test project name",
            key: "test project key",
            lead: userId,
            members: [userId],
            issues: [],
            default_assignee: 'Project Lead',
            start_date: new Date(),
        }).save();
    })

    afterAll(done => {
        return done();
    });

    describe('CREATE', () => {
        test('can create a Status', async () => {
            await new Status({
                _id: statusId,
                name: "test status",
                project: projectId,
                issues: [],
            }).save();
            const status = await Status.findOne({ _id: statusId });
            expect(status.name).toEqual("test status");
        });
    });


    describe('READ', () => {
        test('Can find a particular status by its', async () => {
            const targetStatus = await Status.findOne({ _id: statusId })
            expect(targetStatus.name).toEqual("test status");
        });
        test('Can find all status inside a particular project', async () => {
            const targetStatus = await Status.find({ project: projectId })
            expect(targetStatus.length).toEqual(1);
            expect(targetStatus[0].name).toEqual("test status");
        });

        test.skip('Can not find a single Status with an invalid query', async () => {

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

