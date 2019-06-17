const mongoose=require('mongoose');
var resultSchema=new mongoose.Schema({
    gameOrganizedId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    teamId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    resultType:{
        type:String
    }
});
var ResultModel=mongoose.model('Result',resultSchema);
module.exports=ResultModel;