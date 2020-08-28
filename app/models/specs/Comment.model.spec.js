
const mongoose = require('mongoose');
const db = require("../index");
const Comment = db.comments
const User = db.users
const Issue = db.issues
const Status = db.status
const Project = db.projects
require("regenerator-runtime/runtime");

//TODO delete
//TODO add fail to create comment as part of the required inputs are not complete
//TODO add fail to read comment with invalid query

describe.skip('Comments', () => {
    let userId =  mongoose.Types.ObjectId()
    let issueId =  mongoose.Types.ObjectId()
    let projectId =  mongoose.Types.ObjectId()
    let statusId =  mongoose.Types.ObjectId()
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
    })

    afterAll(done => {
        return done();
    });

    describe('CREATE', () => {
        test('can create a Comment', async () => {
            var id = mongoose.Types.ObjectId();
            await new Comment({
                _id: id,
                author: userId,
                description: "test description",
                date: new Date(),
                issue: issueId
            }).save();
            const comment = await Comment.findOne({ _id: id });
            expect(comment.description).toEqual("test description");
        });
    });

    describe('READ', () => {
        let comments;

        test('All Comments of a particular issue can find be found by the issue id', async () => {
            const targetComment = await Comment.findOne({ issue: issueId })
            expect(targetComment.description).toEqual("test description");
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