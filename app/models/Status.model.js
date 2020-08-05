module.exports = (Schema,model) => {
    var StatusSchema = new Schema({  
         _id:String,
        name: String,
        project:{
            type: Schema.Types.ObjectId,
            ref: "Project"
        },
    });

    return  model('Status', StatusSchema);
}