const mongoose=require('mongoose');
var scheduleSchema=new mongoose.Schema({
    gameOrganizedId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    scheduleDate:{
        type:Date
    },
    schduleVenue:{
        type:String
    }
});
var ScheduleModel=mongoose.model('Schedule',scheduleSchema);
module.exports=ScheduleModel;