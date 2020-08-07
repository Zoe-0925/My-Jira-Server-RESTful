module.exports = (Schema, model) => {
    var UserSchema = new Schema({
        _id: String,
        name: String,
        email: String,
        hash: String,
        salt: String,
        projects: [{
            type: Schema.Types.ObjectId,
            ref: "Project"
        }]
    });
    return model('User', UserSchema);
}