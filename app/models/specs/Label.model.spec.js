
const mongoose = require('mongoose');
const db = require("../index");
const Label = db.labels
const User = db.users
const Project = db.projects
require("regenerator-runtime/runtime");

//TODO delete

describe.skip('Labels', () => {
    let userId = mongoose.Types.ObjectId()
    let projectId = mongoose.Types.ObjectId()
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

    var id = mongoose.Types.ObjectId();
    describe('CREATE', () => {
        test('can create a Label', async () => {
            await new Label({
                _id: id,
                name: "test label",
                project: projectId
            }).save();
            const label = await Label.findOne({ _id: id });
            expect(label.name).toEqual("test label");
        });
    });

    describe('READ', () => {
        test('Can find a particular label by its', async () => {
            const targetLabel = await Label.findOne({ _id: id })
            expect(targetLabel.name).toEqual("test label");
        });
        test('Can find all labels inside a particular project', async () => {
            const targetLabels = await Label.find({ project: projectId })
            expect(targetLabels.length).toEqual(1);
            expect(targetLabels[0].name).toEqual("test label");
        });

        test.skip('Can not find a single label with an invalid query', async () => {
            const targetLabel = await Label.findOne({ issue: issueId })
            expect(targetLabel.description).toEqual("test description");
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