module.exports = (Schema, model) => {
    var StatusSchema = new Schema({
        _id: String,
        name: String,
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project"
        },
        issue_order: [String]
    });

    return model('Status', StatusSchema);
}