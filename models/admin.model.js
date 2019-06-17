const mongoose=require('mongoose');
var adminSchema=new mongoose.Schema({
    adminName:{
        type:String
    },
    adminEmail:{
        type:String
    },
    adminPassword:{
        type:String
    },
    adminMobileNumber:{
        type:String
    },
});

//custom validation for email
adminSchema.path('adminEmail').validate((val)=>{
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
},'Invalid Email');

var Admin=mongoose.model('Admin',adminSchema);
module.exports=Admin;