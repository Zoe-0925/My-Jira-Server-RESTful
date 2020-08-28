module.exports = (Schema, model) => {
    const ProjectSchema = new Schema({
        _id: String,
        name: String,
        key: String,
        category: { type: String, default: '' },
        lead: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        image: { type: String, default: '' },
        issues: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: "Issue"
            }],
            default: []
        },
        default_assignee: { type: String, default: 'Project Lead' },
        start_date: { type: Date, default: Date.now },
    });
    return model('Project', ProjectSchema);
}

