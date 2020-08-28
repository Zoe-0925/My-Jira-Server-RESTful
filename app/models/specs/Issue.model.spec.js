
const mongoose = require('mongoose');
const db = require("../index");
const User = db.users
const Project = db.projects
const Issue = db.issues
const Status = db.status
require("regenerator-runtime/runtime");

//TODO delete

describe.skip('Issues', () => {
    let userId = mongoose.Types.ObjectId()
    let issueId = mongoose.Types.ObjectId()
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
        await new Status({
            _id: statusId,
            name: "test status",
            project: projectId,
            issues: [],
        }).save();
    })

    afterAll(done => {
        return done();
    });

    describe('CREATE', () => {
        test('can create a Label', async () => {
            await new Issue({
                _id: issueId,
                project: projectId,
                summary: "test project summary",
                issueType: "task",
                description: "test description",
                status: statusId,
                assignee: userId,
                startDate: new Date(),
                dueDate: null,
                reportee: null,
            }).save();
            const issue = await Issue.findOne({ _id: issueId });
            expect(issue.summary).toEqual("test project summary");
        });
    });

    describe('READ', () => {
        test('Can find a particular issue by its', async () => {
            const targetIssue = await Issue.findOne({ _id: issueId })
            expect(targetIssue.summary).toEqual("test project summary");
        });
        test('Can find all Issues inside a particular project', async () => {
            const targetIssues = await Issue.find({ project: projectId })
            expect(targetIssues.length).toEqual(1);
            expect(targetIssues[0].summary).toEqual("test project summary");
        });
        test('Can find all Issues inside a particular project of a specific type', async () => {
            const targetIssues = await Issue.find({ project: projectId, issueType: "task" })
            expect(targetIssues.length).toEqual(1);
            expect(targetIssues[0].summary).toEqual("test project summary");
        });

        test.skip('Can not find a single Issue with an invalid query', async () => {
            const targetIssue = await Issue.findOne({ issue: issueId })
            expect(targetIssue.summary).toEqual("test project summary");
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

