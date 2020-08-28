module.exports = (Schema, model) => {
    var UserSchema = new Schema({
        _id: String,
        name: String,
        email: String,
        password: String,
        projects: [{
            type: Schema.Types.ObjectId,
            ref: "Project"
        }],
        githubId: { type: String, default: "" },
        
    });
    return model('User', UserSchema);
}