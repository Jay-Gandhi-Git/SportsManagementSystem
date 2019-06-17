const mongoose=require('mongoose');
var instituteSchema=new mongoose.Schema({
    instituteName:{
        type:String
    },
    instituteEmail:{
        type:String
    },
    institutePassword:{
        type:String
    }
});
var Institute=mongoose.model('Institute',instituteSchema);
module.exports=Institute;