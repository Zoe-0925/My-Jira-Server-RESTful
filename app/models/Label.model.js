module.exports = (Schema,model) => {
    var LabelSchema = new Schema({
        _id:String,
        name: String,
        userId:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    });

    return  model('Label', LabelSchema);
}