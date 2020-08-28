module.exports = (Schema, model) => {
    var IssueSchema = new Schema({
        _id: String,
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
        labels: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: "Label"
            }], default: []
        },
        flag: {
            type: Boolean,
            default: false
        },
        startDate: { type: Date, default: new Date() },
        dueDate: { type: Date, default: null },
        reportee: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        parent: { type: String, deafult: "" },
        chilren: { type: [String], deafult: [] },
        comments: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: "Comment"
            }], default: []
        }
    });

    return model('Issue', IssueSchema);
}

