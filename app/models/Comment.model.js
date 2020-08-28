module.exports = (Schema, model) => {
    var CommentSchema = new Schema({
        _id: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        description: String,
        date: { type: Date, default: new Date() },
        issue: {
            type: Schema.Types.ObjectId,
            ref: "Issue"
        },
        parent: { type: String, default: "" }
    });

    return model('Comment', CommentSchema);
}

