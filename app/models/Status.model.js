module.exports = (Schema,model) => {
    var StatusSchema = new Schema({  
         _id:String,
        name: String,
        user:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    });

    return  model('Status', StatusSchema);
}