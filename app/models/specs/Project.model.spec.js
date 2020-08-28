
const mongoose = require('mongoose');
const db = require("../index");
const User = db.users
const Project = db.projects
require("regenerator-runtime/runtime");

//TODO delete
//TODO test members include the user

describe.skip('Project', () => {
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
    })

    afterAll(done => {
        return done();
    });

    describe('CREATE', () => {
        test('can create a Project', async () => {
            await new Project({
                _id: projectId,
                name: "test project name",
                key: "test project key",
                lead: userId,
                members: [userId],
                issues: [],
                default_assignee: 'Project Lead',
                start_date: new Date(),
            }).save();
            const project = await Project.findOne({ _id: projectId });
            expect(project.name).toEqual("test project name");
        });
    });

    describe('READ', () => {
        test('Can find a particular project by its', async () => {
            const targetProject = await Project.findOne({ _id: projectId })
            expect(targetProject.name).toEqual("test project name");
        });
        test('Can find all Projects led by a particular user ', async () => {
            const targetProject = await Project.find({ lead: userId })
            expect(targetProject.length).toEqual(1);
            expect(targetProject[0].name).toEqual("test project name");
        });

        test.skip('Can not find a single Project with an invalid query', async () => {

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

