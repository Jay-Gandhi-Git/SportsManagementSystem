const mongoose=require('mongoose');
var teamParticipentSchema=new mongoose.Schema({
    teamId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
    },
});
var TeamParticipentModel=mongoose.model('TeamParticipent',teamParticipentSchema);
module.exports=TeamParticipentModel;