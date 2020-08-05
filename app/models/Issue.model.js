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
            enum: ['Epic', 'Task', "Subtask"]
        },
        description: String,
        status: {
            type: String,
            enum: ['In Progress', 'Completed', "Not Started"],
            default: "Not Started"
        },
        assignee: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        labels: [{
            type: Schema.Types.ObjectId,
            ref: "Label"
        }],
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

