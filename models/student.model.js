const mongoose=require('mongoose');
var studentSchema = new mongoose.Schema({
    instituteId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    studentEnrollmentNumber:{
        type:Number
    },
    studentName:{
        type:String
    },
    studentGender:{
        type:String
    },
    studentMobileNumber:{
        type:String
    },
    studentEmail:{
        type:String
    }
});
var Student=mongoose.model('Student',studentSchema);
module.exports=Student;