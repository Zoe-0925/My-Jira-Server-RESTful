module.exports = (Schema,model) => {
    var LabelSchema = new Schema({
        _id:String,
        name: String,
        project:{
            type: Schema.Types.ObjectId,
            ref: "Project"
        }
    });

    return  model('Label', LabelSchema);
}