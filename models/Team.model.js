const mongoose=require('mongoose');
var teamSchema=new mongoose.Schema({
    gameOrganizedId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    teamName:{
        type:String
    }
});
var TeamModel=mongoose.model('Team',teamSchema);
module.exports=TeamModel;