const Project = require('../models/Project.model.js');
const User = require('../models/User.model.js');
const Issue = require('../models/Issue.model.js');
const Label = require('../models/Label.model.js');
const Comment = require('../models/Comment.model.js');
const Status = require('../models/Status.model.js');
const { promisify } = require('../helpers.js');

const resolvers = {
    createProject: (_, args) => promisify(Project.create(args.input)),
    updateProject: (_, args) => promisify(Project.findByIdAndUpdate(args.input.id, args.input)),
    deleteProject: (_, args) => promisify(Project.findByIdAndDelete(args.id)),
    addProjectMember: (_, args) => promisify(Project.findById(args.id).aggregate([
        {
            $project: {
                members: 1,
                $concatArrays: ["$members", [args.userId]]
            }
        }
    ])),
    createUser: (_, args) => promisify(User.create(args.input)),
    deleteUser: (_, args) => promisify(User.findByIdAndDelete(args.id)),
    updateUserPassword: (_, args) => {
        const user = promisify(User.findById(args.input.id))
        user.password = args.input.password
        promisify(user.save())
    },
    updateUserEmail: (_, args) => {
        const user = promisify(User.findById(args.input.id))
        user.email = args.input.email
        promisify(user.save())
    },
    createIssue: (_, args) => promisify(Issue.create(args.input)),
    updateIssue: (_, args) => promisify(Issue.findByIdAndUpdate(args.input.id, args.input)),
    deleteIssue: (_, args) => promisify(Issue.findByIdAndDelete(args.id)),
    addParentToIssue: async (_, args) => {
        const [parent, child] = await Promise.all[Issue.findById(args.input.parentId), Issue.findById(args.input.childId)]
        parent.children = [...parent.children, args.input.childId]
        child.parent = [...child.parent, args.input.parentId]
        await Promise.all[parent.save(), child.save()]
    },
    createComment: (_, args) => promisify(Comment.create(args.input)),
    updateComment: (_, args) => promisify(Comment.findByIdAndUpdate(args.input.id, args.input)),
    deleteComment: (_, args) => promisify(Comment.findByIdAndDelete(args.id)),
    createLabel: (_, args) => promisify(Label.create(args.input)),
    deleteLabel: (_, args) => promisify(Label.findByIdAndDelete(args.id)),
    createLabelAndAddToIssue: async (_, args) => {
        const [label, issue] = await Promise.all[
            Label.create({
                _id: args.input.labelId,
                name: args.input.name,
                userId: args.input.user
            }),
            Issue.findById(args.input.issueId)]
            issue.labels = [...issue.labels, args.input.labelId]
            await issue.save()
    },
    createStatus: (_, args) => promisify(Status.create(args.input)),
    updateStatus: (_, args) => promisify(Status.findByIdAndUpdate(args.input.id, args.input)),
    deleteStatus: (_, args) => promisify(Status.findByIdAndDelete(args.id)),
};

module.exports = resolvers;
