var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
const Admin=require('../models/admin.model');
const Institute=require('../models/insitute.model');
const Game=require('../models/game.model');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/SportsDB"; // SportsDB is the name of db
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config');




// const Admin=require('./models/admin.model');
/* GET home page. */



router.get('/', function(req, res, next) {
  // res.render('Admin/index', { title: 'temp | Admin',layout:"masterLayout" });
    res.render('Admin/login',{title:'BMIIT | Sports'});
});
router.get('/register',function (req, res, next) {
    res.render('Admin/register',{title:'BMIIT | Sports'});
});
router.post('/registerAjax',function (req, res, next) {
    Admin.findOne({adminEmail:req.body.email},function (err, admin) {
        if(err){
            res.json({success:true,msg:"Error when registration"});
        }
        if (!admin){
            var hashedPassword = bcrypt.hashSync(req.body.password, 8);
            var admin = new Admin();
            // Admin.create({
            //     adminName : req.body.name,
            // adminEmail : req.body.email,
            // adminPassword : hashedPassword,
            // adminMobileNumber : req.body.number
            // });
            admin.adminName = req.body.name;
            admin.adminEmail = req.body.email;
            admin.adminPassword = hashedPassword;
            admin.adminMobileNumber = req.body.number;
            admin.save((err, doc) => {
                if (!err)
                    res.json({success:true,msg:null});
                else{
                    res.json({success:true,msg:"Error While Insertion"});
                }
            });
            res.json({success:true,msg:null});
        }

        else{
            res.json({success:true,msg:"Email is already exist"});
        }
    });

});
router.post('/loginAjax',function (req, res, next) {
  var email=req.body.email;
  var password=req.body.password;
    Institute.findOne({instituteEmail:email}).exec(function (err,institute) {
        if(err){
            res.json({success:true,msg:"Error when login"});
        }
        if(institute)
        {

            var passwordIsValid = bcrypt.compareSync(password, institute.institutePassword);
            if(!passwordIsValid)
            {
                res.json({success:true,msg:"Invalid Password"});
            }
            // var token = jwt.sign({ id: institute._id }, config.secret, {
            //     expiresIn: 86400 // expires in 24 hours
            // });
            req.session['userId']=institute._id;
            req.session['email']=institute.instituteEmail; //delete this line it is for checking purpose
            res.json({success:true,msg:"Institute"});
            // res.json({success:true,msg:null,token:token});
        }
        else if (!institute){
            Admin.findOne({adminEmail:email}).exec(function (err, admin) {
                if(err)
                {
                    res.json({success:true,msg:"Admin Invalid Username"});
                }
                if(admin)
                {
                    var passwordIsValid = bcrypt.compareSync(password, admin.adminPassword);
                    if(!passwordIsValid)
                    {
                        res.json({success:true,msg:"Invalid Password"});
                    }
                    // var token = jwt.sign({ id: admin._id }, config.secret, {
                    //     expiresIn: 86400 // expires in 24 hours
                    // });
                    req.session['userId']=admin._id;
                    res.json({success:true,msg:"Admin"});
                }
            })
        }
        else {res.json({success:true,msg:"Institute Invalid Username"});}
    });

});

router.get('/dashboard', function(req, res, next) {
    if(req.session['userId']!=null)
        res.render('Admin/dashboard',{title:'BMIIT | Sports',layout:"adminMasterLayout"});
    else
        res.redirect('/');
});
router.get('/dashboardGetAjax', function(req, res, next) {
    // res.render('Admin/index', { title: 'temp | Admin',layout:"masterLayout" });
    //
    Institute.find(function (err, docs) {
        if(!err)
        {
            var ins=docs.length;
            Game.find(function (err, docs) {
                if(!err)
                {
                    // var id=req.session['userId'];
                    res.json({success:true,flag:1,ins:ins,gms:docs.length});
                }
                else {
                    res.json({success:false,flag:0,msg:"Error retriving data"});
                }
            });

        }
        else {
            res.json({success:false,flag:0,msg:"Error retriving data"});
        }
    });
});

router.get('/institute', function(req, res, next) {
    if(req.session['userId']!=null)
        res.render('Admin/institute',{title:'BMIIT | Sports',layout:"adminMasterLayout"});
    else
        res.redirect('/');
});
router.post('/instituteAddAjax',function (req, res, next) {
        var institute=new Institute();
        institute.instituteName=req.body.name;
        institute.instituteEmail=req.body.email;
        var hashedPassword = bcrypt.hashSync("123456", 8);
        institute.institutePassword=hashedPassword;
        institute.save((err,doc)=>{
            if(!err)
                res.json({success:true,msg:null});
            else
                res.json({success:true,msg:"Error While Insertion"});
        });
});

router.post('/instituteGetDataUpdateAjax',function (req, res, next) {
    Institute.findById(req.body.id,function (err,institute) {
        if(!err)
        {
            res.json({success:true,flag:1,msg:institute});
        }
        else {
            res.json({success:false,flag:0,msg:"Error retriving data"});
        }
    });
});
router.post('/instituteUpdateAjax',function (req, res, next) {
    Institute.findById(req.body.id,function (err, institute) {
        institute.instituteName=req.body.name;
        institute.instituteEmail=req.body.email;
        institute.save((err,doc)=>{
            if(!err)
                res.json({success:true,msg:null});
            else
                res.json({success:true,msg:"Error While Insertion"});
        });
    });
});
router.post('/instituteDeleteSingleAjax',function (req, res, next) {
    Institute.findByIdAndRemove(req.body.id,function (err, institute) {
        if(!err)
        {
            res.json({success:true,msg:"Successfully deleted "});
        }
        else {
            res.json({success:true,msg:"Error in deletion"});
        }
    });
});
router.post('/instituteGetAjax',function (req, res, next) {
    Institute.find(function (err, docs) {
        if(!err)
        {
            res.json({success:true,flag:1,msg:docs});
        }
        else {
            res.json({success:false,flag:0,msg:"Error retriving data"});
        }
    });
});
router.get('/game', function(req, res, next) {
    if(req.session['userId']!=null)
        res.render('Admin/game',{title:'BMIIT | Sports',layout:"adminMasterLayout"});
    else
        res.redirect('/');
});
router.post('/gameAddAjax',function (req, res, next) {
    var game=new Game();
    game.gameName=req.body.name;
    game.gameType=req.body.type;
    game.gameDescription=req.body.description;
    game.gameTeamType=req.body.gameTeamType;
    game.save((err,doc)=>{
       if(!err)
       {
           res.json({success:true,msg:null});
       }
       else
       {
           res.json({success:true,msg:"Error While Insertion"});
       }
    });
});
router.post('/gameGetAjax',function (req, res, next) {
    Game.find(function (err, docs) {
        if(!err)
        {
            res.json({success:true,flag:1,msg:docs});
        }
        else
        {
            res.json({success:false,flag:0,msg:"Error retriving data"});
        }
    });
});
router.post('/gameGetDataUpdateAjax',function (req, res, next) {
    Game.findById(req.body.id,function (err,game) {
        if(!err)
        {
            res.json({success:true,flag:1,msg:game});
        }
        else {
                res.json({success:false,flag:0,msg:"Error retriving data"});
        }
    });
});
router.post('/gameUpdateAjax',function (req,res,next) {
    Game.findById(req.body.id,function (err, game) {
        game.gameName=req.body.name;
        game.gameType=req.body.type;
        game.gameDescription=req.body.description;
        game.gameTeamType=req.body.gameTeamType;
        game.save((err,doc)=>{
            if(!err)
                res.json({success:true,msg:null});
            else
                res.json({success:true,msg:"Error While Insertion"});
        });
    });
});
router.post('/gameDeleteSingleAjax',function (req, res, next) {
    Game.findByIdAndRemove(req.body.id,function (err, game) {
        if(!err)
        {
            res.json({success:true,msg:"Successfully deleted "});
        }
        else {
            res.json({success:true,msg:"Error in deletion"});
        }
    });
});
router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
    // res.render('Admin/login',{title:'BMIIT | Sports'});
});
module.exports = router;
