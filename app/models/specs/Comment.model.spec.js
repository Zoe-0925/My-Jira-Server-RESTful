
const mongoose = require('mongoose');
const db = require("../index");
const Comment = db.comments
const User = db.users
const Issue = db.issues
require("regenerator-runtime/runtime");


describe('Comments', () => {
    let userId = mongoose.Types.ObjectId();
    let issueId = mongoose.Types.ObjectId();
    let projectId = mongoose.Types.ObjectId();
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
            default_assignee: { type: String, default: 'Project Lead' },
            start_date: { type: Date, default: Date.now },
        }).save();
        await new Issue({
            _id: issueId,
            project: {
                type: Schema.Types.ObjectId,
                ref: "Project"
            },
            summary: String,
            issueType: {
                type: String,
                enum: ['epic', 'task', "subtask"]
            },
            description: String,
            status: {
                type: Schema.Types.ObjectId,
                ref: "Status"
            },
            assignee: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            labels: [{
                type: Schema.Types.ObjectId,
                ref: "Label"
            }],
            flag: {
                type: Boolean,
                default: false
            },
            startDate: Date,
            dueDate: Date,
            reportee: [{
                type: Schema.Types.ObjectId,
                ref: "User"
            }],
            parent: String,
            chilren: [String],
            comments: [{
                type: Schema.Types.ObjectId,
                ref: "Comment"
            }],
        }).save();
    })

    afterAll(done => {
        return done();
    });

    describe('CREATE', () => {
        let comments;

        test('can create a Comment', async () => {
            var id = mongoose.Types.ObjectId();
            const now = new Date()
            await new Comment({
                _id: id,
                author: "test",
                description: "test description",
                date: now,
                issue: "test",
                parent: String
            }).save();
            const comment = await Comment.findOne({ id: id });
            expect(comment.description).toEqual("test description");
        });
    });

    describe('READ', () => {
        let comments;

        test('All Comments of a particular issue can find be found by the issue id', async () => {
            const targetComment = await Comment.findOne({ issue: "test" })
            expect(targetComment.name).toEqual('Sol');
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