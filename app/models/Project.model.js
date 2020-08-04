module.exports = (Schema, model) => {
    const ProjectSchema = new Schema({
        _id:String,
        name: String,
        key: String,
        category: String,
        lead: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        image: String,
        issues: [{
            type: Schema.Types.ObjectId,
            ref: "Issue"
        }],
        default_assignee: { type: String, default: 'Project Lead' },
        start_date: { type: Date, default: Date.now },
    });
    return model('Project', ProjectSchema);
}

