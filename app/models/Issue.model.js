module.exports = (Schema, model) => {
    var IssueSchema = new Schema({
        _id:String,
        project:{
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
    });

    return model('Issue', IssueSchema);
}

