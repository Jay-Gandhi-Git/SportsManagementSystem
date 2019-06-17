const mongoose=require('mongoose');
var gameOrganizedSchema=new mongoose.Schema({
    instituteId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    gameId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    gameOrganizeYear:{
        type:Date
    },
    gender:{
        type:String
    }
});
var GameOrganizedModel=mongoose.model('GameOrganize',gameOrganizedSchema);
module.exports=GameOrganizedModel;