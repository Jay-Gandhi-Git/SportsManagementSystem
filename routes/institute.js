var express = require('express');
var async = require('async');
var sync = require('sync');
var router = express.Router();
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
// const Institute = require('../models/insitute.model');
const Institute = require('../models/insitute.model');
const Game = require('../models/game.model');
const Student = require('../models/student.model');
const GameOrganize = require('../models/gameOrganized.model');
const Team = require('../models/Team.model');
const TeamParticipent = require('../models/TeamParticipent.model');
const Schedule = require('../models/schedule.model');
const Result = require('../models/result.model');

const multer = require('multer');
const path = require('path');
var csv = require("fast-csv");
var fs = require('fs');


var tempFile = "";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = "public/upload/" + req.session['email'];
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        // cb(null, 'public/upload');
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        tempFile = new Date().toDateString() + '-' + file.originalname;
        cb(null, new Date().toDateString() + '-' + file.originalname);
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.csv') {
            req.fileValidationError = "Invalid File Type";
            return callback(null, false, req.fileValidationError);
        }
        callback(null, true);
    }

});


router.get('/home', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        res.render('Institute/dashboard', {title: 'BMIIT | Sports', layout: "instituteMasterLayout"});
    }
    else {
        res.redirect('/');
    }
});
router.post('/dashboardGetAjax', function (req, res, next) {
    var id = req.session['userId'];
    if (id !== null) {
        Student.find({instituteId: id}, function (err, students) {
            if (!err) {
                var len = students.length;
                GameOrganize.find({instituteId: id}, function (err, gameorganizes) {
                    if (!err) {
                        Institute.findById({_id: id}, function (err, institutes) {
                            if (!err) {
                                res.json({
                                    success: true,
                                    flag: 1,
                                    totalStudent: len,
                                    totalGameOrganizes: gameorganizes.length,
                                    instittuteName: institutes.instituteName
                                });
                            }
                            else {

                            }
                        });

                    }
                    else {
                        res.json({success: false, flag: 0, msg: "Error retriving data"});
                    }
                });
                // return res.json({success: true, flag: 1, totalStudent: len});
            }
            else {
                return res.json({success: false, flag: 0, msg: "Error retriving data"});
            }
        });
    }
    else {
        return res.json({msg: 'Session Expired'});
    }
});
router.get('/students', function (req, res, next) {
    if (req.session['userId'] != null) {
        res.render('Institute/students', {layout: "instituteMasterLayout"});
    }
    else {
        res.redirect('/');
    }
});
router.post('/studentsAddCSVAjax', upload.single('st_file'), function (req, res, next) {
    if (req.session['userId'] != null) {
        if (req.fileValidationError) {
            res.json({msg: 'Error!:-' + req.fileValidationError});
        }
        else if (req.file) {
            var tempId = req.session['userId'];
            var dir = "public/upload/" + req.session['email'] + "/";
            var csvfile = dir + tempFile;
            var stream = fs.createReadStream(csvfile);

            var csvStream = csv()
                .on("data", function (data) {

                    var item = new Student({
                        instituteId: tempId,
                        studentEnrollmentNumber: data[0],
                        studentName: data[1],
                        studentMobileNumber: data[2],
                        studentEmail: data[3],
                        studentGender: data[4]
                    });

                    item.save(function (error) {
                        console.log(item);
                        if (error) {
                            throw error;
                        }
                    });

                }).on("end", function () {

                });

            stream.pipe(csvStream);
            res.json({success: true, msg: null});
        }
        else {
            res.json({success: true, msg: "Please upload the file"});
        }


        // Institute.findOne({instituteEmail:req.session['email']}).exec(function (err,institute) {
        //     if (err) {
        //         res.json({success: true, msg: "Error when login"});
        //     }
        //     if (institute) {
        //         res.json({msg: "Institute"});
        //         // res.json({success:true,msg:null,token:token});
        //     }
        // });
    }
    else {
        res.json({success: true, msg: "Session Expired"});
    }
});
router.post('/studentsAddManualAjax', function (req, res, next) {
    if (req.session['userId'] != null) {
        Student.findOne({studentEnrollmentNumber: req.body.studentsEnrollmentNumber}).exec(function (err, student) {
            if (err) {
                return res.json({msg: err});
            }
            else if (student) {
                return res.json({msg: "Student is already exist"});
            }
            else if (!student) {
                Student.findOne({studentEmail: req.body.studentsEmail}).exec(function (err, student) {
                    if (err) {
                        return res.json({msg: err});
                    }
                    else if (student) {
                        return res.json({msg: "Student's Email is already exist"});
                    }
                    else if (!student) {
                        var tempId = req.session['userId'];
                        var student = new Student();
                        student.instituteId = tempId;
                        student.studentEmail = req.body.studentsEmail;
                        student.studentEnrollmentNumber = req.body.studentsEnrollmentNumber;
                        student.studentMobileNumber = req.body.studentMobileNumber;
                        student.studentName = req.body.studentsName;
                        student.save((err, doc) => {
                            if (!err)
                                return res.json({success: true, msg: null});
                            else
                                return res.json({success: true, msg: "Error While Insertion"});
                        });
                    }
                });


            }
        });

    }
    else {
        res.json({msg: "Session Expired"});
    }
});
router.post('/studentGetAjax', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        Student.find({instituteId: id}, function (err, docs) {
            if (!err) {
                res.json({success: true, flag: 1, msg: docs, totalStudent: docs.length});
            }
            else {
                res.json({success: false, flag: 0, msg: "Error retriving data"});
            }
        });
    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});
router.post('/studentGetDataUpdateAjax', function (req, res, next) {
    Student.findById(req.body.id, function (err, student) {
        if (!err) {
            res.json({success: true, flag: 1, msg: student});
        }
        else {
            res.json({success: false, flag: 0, msg: "Error retriving data"});
        }
    });
});
router.post('/studentUpdateAjax', function (req, res, next) {
    Student.findById(req.body.id, function (err, studentUpdate) {
        // institute.instituteName=req.body.name;
        // institute.instituteEmail=req.body.email;
        if (studentUpdate) {
            var tempId = req.session['userId'];
            studentUpdate.instituteId = tempId;
            studentUpdate.studentEmail = req.body.studentsEmail;
            studentUpdate.studentEnrollmentNumber = req.body.studentsEnrollmentNumber;
            studentUpdate.studentMobileNumber = req.body.studentMobileNumber;
            studentUpdate.studentName = req.body.studentsName;
            studentUpdate.save((err, doc) => {
                if (!err)
                    res.json({success: true, msg: null});
                else
                    res.json({success: true, msg: "Error While Update"});
            });
        }
    });
});
router.post('/studentDeleteSingleAjax', function (req, res, next) {
    Student.findByIdAndRemove(req.body.id, function (err, student) {
        if (!err) {
            return res.json({success: true, msg: "Successfully deleted "});
        }
        else {
            return res.json({success: true, msg: "Error in deletion"});
        }
    });
});
router.get('/gameOrganize', function (req, res, next) {
    console.log('I came');
    var id = req.session['userId'];
    if (id != null) {
        res.render('Institute/gameOrganize', {title: 'BMIIT | Sports', layout: "instituteMasterLayout"});
    }
    else {
        res.redirect('/');
    }
});
router.post('/scheduleGetData', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        Game.find(function (err, docs) {
            if (err) {
                return res.json({success: true, msg: "Error while retriving data"});
            }
            else if (docs) {
                Student.find({instituteId: id}, function (err, students) {
                    if (err) {
                        return res.json({success: true, msg: "Error while retriving data"});
                    }
                    else if (students) {
                        return res.json({success: true, msg: docs, students: students});
                    }
                });
            }
            // return res.json({success:true,msg:docs});
        });
    }
    else {
        res.redirect('/');
    }
});

router.post('/instituteGameOrganiseAddAjax', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        Game.find({gameName: req.body.GameName}, function (err, docs) {
            if (!err) {
                req.session['gameId'] = docs[0]["_id"];
                console.log("Game id is " + req.session['gameId']);
                var gameid = req.session['gameId'];
                console.log("And Game id is " + gameid);
                var gameOrganize = new GameOrganize();
                gameOrganize.instituteId = id;
                gameOrganize.gameId = gameid;
                gameOrganize.gameOrganizeYear = req.body.year;
                gameOrganize.gender = req.body.gender;
                gameOrganize.save((err, gameorganises) => {
                    if (!err) {
                        var team = new Team();
                        team.gameOrganizedId = gameOrganize._id;
                        team.teamName = req.body.TeamName;
                        team.save((err, teams) => {
                            if (!err) {
                                var flag = 0;
                                for (var i = 0; i < req.body.chkArray.length; i++) {
                                    var teamParticpant = new TeamParticipent();
                                    teamParticpant.teamId = team._id;
                                    teamParticpant.studentId = req.body.chkArray[i];
                                    teamParticpant.save();
                                    if ((i + 1) === req.body.chkArray.length) {
                                        flag = 1;
                                    }
                                }
                                if (flag === 1) {
                                    res.json({
                                        success: true,
                                        msg: "Successfully add Game Organize & team & team member"
                                    });
                                }
                                else {
                                    res.json({
                                        msg: "Failed to save records"
                                    });
                                }

                            }
                            else {
                                res.json({
                                    msg: "Error to saving team"
                                });
                            }
                        });

                    }
                    else {
                        res.json({
                            msg: "Error to saving gameorganize"
                        });
                    }
                });
            }
            else {
                return res.json({
                    msg: "Error in game find"
                });
            }
        });
    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }


    // return res.json({
    //     msg:"Hello jay",
    //     chkArray:req.body.chkArray.length,
    //     TeamName:req.body.TeamName,
    //     GameName:req.body.GameName,
    //     year:req.body.year,
    //     gender:req.body.gender,
    // });
});


var gameNameAry = Array();
var gameIdAry = Array();
var goiIdAry = Array();
var teamIdAry = Array();
var studentsIdAry = Array();
var totalTeamParticipantAry = Array();
var sheduleWholeData = new Array();
var teamNameAry = Array();
var resultAry = Array();
router.post('/instituteGameOrganizeGetAllDataAjax', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        var done = 0;
        var flag = 0;
        GameOrganize.find({instituteId: id}).then(gameOrganizes => {
            gameIdAry = [];
            goiIdAry = [];
            teamIdAry = [];
            gameNameAry = [];
            studentsIdAry = [];
            totalTeamParticipantAry = [];
            var gameOrganizeYearArray = Array();
            var gameOrganizeGenderArray = Array();
            var done = 0;
            var flag = 0;
            for (var i = 0; i < gameOrganizes.length; i++) {
                goiIdAry.push([gameOrganizes[i]["_id"], gameOrganizes[i]["gameId"], gameOrganizes[i]["gender"]]);
                // gameIdAry.push(gameOrganizes[i]["gameId"]);
                goiIdAry[i][3] = gameOrganizes[i]["gameOrganizeYear"];
                goiIdAry[i][4] = "";

            }
            gamesData(goiIdAry).then(result => {
                console.log(result + " AFter CAlled ");
                // console.log("result  AFter CAlled");
                // goiIdAry[i][4] = result;
                // done++;
                teamsData(goiIdAry).then(teamresult => {
                    for (var i = 0; i < goiIdAry.length; i++) {
                        done++;
                        goiIdAry[i][4] = result[i];
                        goiIdAry[i][5] = teamresult[i];
                        if (done === goiIdAry.length) {
                            res.json({
                                success: true,
                                msg: "Ha success thai gyu",
                                goiIdArray: goiIdAry
                            })
                        }
                    }
                }).catch(reason => {
                    res.json({
                        success: true,
                        msg: "Fail thai gyu teamsData ma " + reason,
                    })
                });

            }).catch(reason => {
                res.json({
                    success: true,
                    msg: "Fail thai gyu" + reason,
                })
            });
        });
    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});

async function gamesData(goiIdAry) {
    // console.log(gameIdAry);
    var gameName = "";
    let promise = new Promise((resolve, reject) => {
        var i = 0;
        async.forEach(goiIdAry, function process(item, next) {
            // console.log("Item came and length is "+item.length);
            // console.log("goiIdAry ma game ni id " + goiIdAry.length);
            // console.log("Item is " + item[1]);
            Game.findById(item[1], function (err, games) {
                if (err) {
                    console.log("Games error " + err);
                }
                // console.log("Games is " + games);
                gameName = games["gameName"];
                gameNameAry.push(gameName);
                next();
            });
            // console.log("Item " + item);
            // Game.find({_id: goiIdAry[i][1]}).then(games => {
            //     game = games[0];
            //     goiIdAry[i][4] = game["gameName"];
            //     // gameNameAry.push(game["gameName"]);
            //     console.log("games for " + game["gameName"]);
            //     next();
            // }).catch(err => {
            //     console.log("Error " + err);
            // });

        }, function allDone() {
            // console.log(gameName);
            resolve(gameNameAry);
        });
        // async.each(goiIdAry, function process(item, next) {
        //
        //
        //
        //     // Game.find({_id: item}).then(games => {
        //     //     game = games[0];
        //     //     gameNameAry.push(game["gameName"]);
        //     //     console.log("games for " + game["gameName"]);
        //     //     next();
        //     // }).catch(err => {
        //     //     console.log("Error " + err);
        //     // });
        // }, function allDone() {
        //     console.log(goiIdAry);
        //     resolve(goiIdAry);
        // });
    });
    let result = await promise;
    return result;
}

async function teamsData(goiIdAry) {
    let promise = new Promise((resolve, reject) => {
        async.forEach(goiIdAry, function process(item, next) {
            Team.find({gameOrganizedId: item[0]}).then(teams => {
                for (var i = 0; i < teams.length; i++) {
                    tempTeamId = teams[i];
                    // teamIdAry.push(tempTeamId["_id"]);
                    TeamParticipent.find({teamId: tempTeamId["_id"]}, function (err, teamParticipants) {
                        if (err) {
                            console.log("Team participant find krvama error avi " + err);
                        }
                        console.log("teamParticipants length is " + teamParticipants.length);
                        // for(var i=0;i<teamParticipants.length;i++)
                        // {
                        //     Student.findById(teamParticipants[i]["studentId"],function (err, students) {
                        //        if(err)
                        //        {
                        //            console.log("Team participant ma student find krvama error avi "+err);
                        //        }
                        //        studentsIdAry.push([students["_id"]])
                        //     });
                        // }
                        totalTeamParticipantAry.push(teamParticipants.length);
                        next();
                    });
                    console.log("teams for " + tempTeamId["_id"]);
                }
            }).catch(err => {
                console.log("Error " + err);
            });
        }, function allDone() {
            console.log("Length avi " + totalTeamParticipantAry);
            resolve(totalTeamParticipantAry);
        });
    });
    let teamresult = await promise;
    return teamresult;
}

async function studentsIDData(teamIdAry) {
    let promise = new Promise((resolve, reject) => {
        async.each(teamIdAry, function process(item, next) {
            TeamParticipent.find({teamId: item}).then(teamParticipents => {
                // for(var i=0;i<teamParticipents.length;i++)
                // {
                //     temp=teamParticipents[i];
                //     studentsIdAry.push(temp["studentId"]);
                //     console.log("students for " + temp["studentId"]);
                // }
                studentsIdAry.push(teamParticipents.length);
                next();
            }).catch(err => {
                console.log("Error " + err);
            });
        }, function allDone() {
            console.log(studentsIdAry);
            resolve(studentsIdAry);
        });
    });
    let studentresult = await promise;
    return studentresult;
}

router.post('/instituteGameOrganizeGetAllDataUpdateAjax', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        var GoId = req.body.id;
        var tempTeamId = 0;
        goiIdAry = [];
        studentsIdAry = [];
        var done = 0;
        GameOrganize.findById(GoId, function (err, gameOrganizes) {
            if (err) {
                console.log("Game organizes find krvama error avi " + err);
            }

            goiIdAry.push(gameOrganizes["_id"]);
            goiIdAry.push(gameOrganizes["gender"]);
            goiIdAry.push(gameOrganizes["gameOrganizeYear"]);
            goiIdAry.push(gameOrganizes["gameId"]);

            Team.find({gameOrganizedId: gameOrganizes["_id"]}, function (err, teams) {
                if (err) {
                    console.log("Teams find krvama error avi " + err);
                }
                goiIdAry.push(teams[0]["teamName"]);
                tempTeamId = teams[0]["_id"];
                console.log("temp team id " + tempTeamId);
                Game.findById(gameOrganizes["gameId"], function (err, games) {
                    if (err) {
                        console.log("Game find krvama error avi " + err);
                    }
                    goiIdAry.push(games["gameName"]);
                    TeamParticipent.find({teamId: tempTeamId}, function (err, teamsParticipents) {
                        if (err) {
                            console.log("Teams participent find krvama error avi " + err);
                        }
                        // console.log("team Participan " + teamsParticipents);
                        for (var i = 0; i < teamsParticipents.length; i++) {
                            studentsIdAry.push(teamsParticipents[i]["studentId"]);
                            done++;
                        }
                        if (done === teamsParticipents.length) {
                            console.log("Student Id are fetched");
                            res.json({
                                success: true,
                                msg: "Student Id are fetched",
                                studentId: studentsIdAry,
                                goiIdAry: goiIdAry
                            });
                        }
                    });
                });

            });

        });
    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});

router.post('/instituteGameOrganizeUpdateAjax', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        var GoId = req.body.id;
        var tempTeamId = 0;
        Game.find({gameName: req.body.GameName}, function (err, docs) {
            if (!err) {
                req.session['gameId'] = docs[0]["_id"];
                console.log("Game id is " + req.session['gameId']);
                var gameid = req.session['gameId'];
                console.log("And Game id is " + gameid);
                GameOrganize.findById(GoId, function (err, gameOrganize) {
                    if (err) console.log("Game organize find krvama error avi " + err);
                    gameOrganize.instituteId = id;
                    gameOrganize.gameId = gameid;
                    gameOrganize.gameOrganizeYear = req.body.year;
                    gameOrganize.gender = req.body.gender;
                    gameOrganize.save((err, gameorganises) => {
                        if (!err) {
                            Team.find({gameOrganizedId: GoId}, function (err, team) {
                                if (err) console.log("Team find krvama error avi " + err);
                                team[0].gameOrganizedId = GoId;
                                team[0].teamName = req.body.TeamName;
                                tempTeamId = team[0]["_id"];
                                team[0].save((err, teams) => {
                                    if (!err) {
                                        var flag = 0;
                                        TeamParticipent.find({teamId: tempTeamId}, function (err, teamParticipent) {
                                            if (err) console.log("Team participent find krvama error " + err);
                                            // for (var i = 0; i < req.body.chkArray.length; i++) {
                                            if (req.body.chkArray.length === teamParticipent.length) {
                                                for (var i = 0; i < req.body.chkArray.length; i++) {
                                                    teamParticipent[i]["teamId"] = tempTeamId;
                                                    teamParticipent[i]["studentId"] = req.body.chkArray[i];
                                                    teamParticipent[i].save();
                                                    if ((i + 1) === req.body.chkArray.length) {
                                                        flag = 1;
                                                    }
                                                }
                                                if (flag === 1) {
                                                    res.json({
                                                        success: true,
                                                        msg: "Successfully Updated Game Organize & team & team member"
                                                    });
                                                }
                                                else {
                                                    res.json({
                                                        msg: "Failed to save records"
                                                    });
                                                }
                                            }
                                            else if (req.body.chkArray.length > teamParticipent.length) {
                                                for (var i = 0; i < req.body.chkArray.length; i++) {
                                                    if (i > (teamParticipent.length - 1)) {
                                                        var teamParticpant = new TeamParticipent();
                                                        teamParticpant.teamId = tempTeamId;
                                                        teamParticpant.studentId = req.body.chkArray[i];
                                                        teamParticpant.save();
                                                    }
                                                    else {
                                                        teamParticipent[i]["teamId"] = tempTeamId;
                                                        teamParticipent[i]["studentId"] = req.body.chkArray[i];
                                                        teamParticipent[i].save();
                                                    }
                                                    if ((i + 1) === req.body.chkArray.length) {
                                                        flag = 1;
                                                    }
                                                }
                                                if (flag === 1) {
                                                    res.json({
                                                        success: true,
                                                        msg: "Successfully Updated Game Organize & team & team member"
                                                    });
                                                }
                                                else {
                                                    res.json({
                                                        msg: "Failed to save records"
                                                    });
                                                }
                                            }
                                            else if (req.body.chkArray.length < teamParticipent.length) {
                                                for (i = 0; i < req.body.chkArray.length; i++) {

                                                    if (i === (req.body.chkArray.length - 1)) {

                                                        // console.log("Ek conditionn ma avi gyo");
                                                        teamParticipent[i]["teamId"] = tempTeamId;
                                                        teamParticipent[i]["studentId"] = req.body.chkArray[i];

                                                        teamParticipent[i].save();

                                                        for (var j = (i + 1); j < teamParticipent.length; j++) {

                                                            TeamParticipent.findByIdAndDelete(teamParticipent[j]["_id"], function (err, teamPrticipentsDelete) {
                                                                if (err) console.log("Team participent delete krva gya to error avi " + err);
                                                                console.log("I ni value (If bloack ma) " + i);
                                                            });
                                                            if ((j + 1) === teamParticipent.length) {
                                                                flag = 1;
                                                            }
                                                        }
                                                        if (flag === 1) {
                                                            res.json({
                                                                success: true,
                                                                msg: "Successfully Updated Game Organize & team & team member"
                                                            });
                                                        }
                                                        else {
                                                            res.json({
                                                                msg: "Failed to save records"
                                                            });
                                                        }
                                                    }
                                                    else {
                                                        console.log("I ni value " + i);
                                                        teamParticipent[i]["teamId"] = tempTeamId;
                                                        teamParticipent[i]["studentId"] = req.body.chkArray[i];
                                                        teamParticipent[i].save();
                                                    }

                                                }

                                            }
                                            // }
                                        });
                                        // for (var i = 0; i < req.body.chkArray.length; i++) {
                                        //     var teamParticpant = new TeamParticipent();
                                        //     teamParticpant.teamId = team._id;
                                        //     teamParticpant.studentId = req.body.chkArray[i];
                                        //     teamParticpant.save();
                                        //     if ((i + 1) === req.body.chkArray.length) {
                                        //         flag = 1;
                                        //     }
                                        // }
                                    }
                                    else {
                                        res.json({
                                            msg: "Error to saving team"
                                        });
                                    }
                                });
                            });


                        }
                        else {
                            res.json({
                                msg: "Error to saving gameorganize"
                            });
                        }
                    });
                });

            }
            else {
                return res.json({
                    msg: "Error in game find"
                });
            }
        });
    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});


router.post('/instituteGameOrganizeDeleteAjax', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        var GoId = req.body.id;
        teamIdAry = [];
        GameOrganize.findByIdAndDelete(GoId, function (err, gameOrganizes) {
            if (err) {
                console.log("Game organises find and delete krvama error avi " + err);
            }
            console.log("Hi i came here");
            Team.find({gameOrganizedId: GoId}, function (err, teams) {
                var done = 0;
                var flag = 0;
                if (err) {
                    console.log("Teams find krvama error avi " + err);
                }
                for (var i = 0; i < teams.length; i++) {
                    done++;
                    teamIdAry.push(teams[i]["_id"]);
                    TeamParticipent.deleteMany({teamId: teams[i]["_id"]}, function (err, teamParticipants) {
                        if (err) {
                            console.log("Team participant delete krvaa error " + err);
                        }
                    })
                }

                if (done === teams.length) {
                    console.log("Team id array " + teamIdAry);
                    Team.deleteMany({gameOrganizedId: GoId}, function (err, teamsAfterDelete) {
                        if (err) {
                            console.log("Team delete krvama error avi " + err);
                        }
                    });
                    flag = 1;
                }
                if (flag === 1) {
                    res.json({
                        success: true,
                        msg: "Successfully deleted"
                    });
                }
            });

        });
    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});


router.get('/gameSchedule', function (req, res, next) {
    // console.log('I came');
    var id = req.session['userId'];
    if (id != null) {
        res.render('Institute/schedule', {title: 'BMIIT | Sports', layout: "instituteMasterLayout"});
    }
    else {
        res.redirect('/');
    }
});
router.post('/instituteScheduleGetAllDataAjax', function (req, res, next) {
    var id = req.session['userId'];

    if (id != null) {
        goiIdAry = [];
        GameOrganize.find({instituteId: id}).then(gameOrganises => {
            goiIdAry.push(gameOrganises);

            // for (var i = 0; i < gameOrganises.length; i++) {
            //     Game.find({_id: gameOrganises[i]["gameId"]}, function (err, games) {
            //         if (!err) {
            //             sheduleWholeData[i]=[];
            //             sheduleWholeData[i][0] = gameOrganises[i]["_id"];
            //             sheduleWholeData[i][1] = games[0]["gameName"];
            //             Schedule.find({gameOrganizedId: gameOrganises[0]["_id"]}).then(schedules => {
            //                 sheduleWholeData[i][2] = schedules[0]["scheduleDate"];
            //                 sheduleWholeData[i][3] = schedules[0]["schduleVenue"];
            //             })
            //         }
            //     });
            // }
            scheduleData(goiIdAry).then(result => {
                res.json({
                    success: true,
                    // gameIdAry: gameIdAry,
                    sheduleWholeData: sheduleWholeData
                });
            });

        })

    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});

async function scheduleData(goiIdAry) {
    console.log(goiIdAry);
    let promise = new Promise((resolve, reject) => {
        var done = 0;
        async.forEach(goiIdAry, function process(item, next) {
            for (var i = 0; i < item.length; i++) {
                console.log("Item array is " + i + " " + item.length);
                console.log("Item array is " + i + " " + item[i]["gameId"]);
                Game.find({_id: item[i]["gameId"]}).then(games => {

                    console.log("Item game name is " + games[0]["gameName"]);
                    // next();
                    // Schedule.find({gameOrganizedId:item[i]["_id"]}).then(schedules=>{
                    //     console.log("Schedules are "+schedules);
                    // })
                });
                done++;
            }
            if (done === item.length)
                next();
        }, function allDone() {
            console.log("All Done");
            resolve(sheduleWholeData);
        });

        // async.each(goiIdAry, function process(item, next) {
        //
        //     next();
        // }, function allDone() {
        //     console.log(sheduleWholeData);
        //     resolve(sheduleWholeData);
        // });
    });
    let result = await promise;
    return result;

}

router.post('/instituteScheduleAddAjax', function (req, res, next) {
    var id = req.session['userId'];
    var goId = "";
    if (id != null) {
        // var gameName=req.body.gameName;
        var gender = req.body.gender;
        Game.find({gameName: req.body.gameName}, function (err, docs) {
            if (!err) {
                var gameId = docs[0]._id;
                console.log("Game Id " + gameId);
                GameOrganize.find({gameId: gameId, gender: gender}, function (err, gameOrganize) {
                    if (!err) {
                        goId = gameOrganize[0]._id;
                        console.log("GoID " + goId);
                        var schedule = new Schedule();
                        schedule.gameOrganizedId = goId;
                        schedule.scheduleDate = req.body.scheduleDate;
                        schedule.schduleVenue = req.body.scheduleVenue;
                        schedule.save((err, students) => {
                            if (!err) {
                                res.json({
                                    success: true,
                                    msg: "Successfully schedule created",
                                });
                            }
                            else {
                                res.json({
                                    success: true,
                                    msg: "Failed to create the schedule",
                                });
                            }
                        });

                    }
                });
            }
        });


    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});


router.get('/gameResult', function (req, res, next) {
    // console.log('I came');
    var id = req.session['userId'];
    if (id != null) {
        res.render('Institute/result', {title: 'BMIIT | Sports', layout: "instituteMasterLayout"});
    }
    else {
        res.redirect('/');
    }
});

router.post('/instituteResultTeamBindAjax', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        GameOrganize.find({instituteId: id}).then(gameOrganises => {
            teamNameAry = [];
            var done = 0;
            for (var i = 0; i < gameOrganises.length; i++) {

                Team.find({gameOrganizedId: gameOrganises[i]["_id"]}, function (err, teams) {
                    done++;
                    if (err) console.log("Teams find krva ma error avi " + err);
                    teamNameAry.push(teams[0]["teamName"]);
                    console.log("Here avi gyo complete " + teams[0]["teamName"]);
                    if (done === gameOrganises.length) {
                        res.json({
                            success: true,
                            teamNameAry: teamNameAry
                        });
                    }
                });

            }

        }).catch(err => {
            res.json({
                success: true,
                msg: "Error while retriving data"
            });
        })
    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});
router.post('/instituteResultAllDataBindAjax', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        GameOrganize.find({instituteId: id}).then(gameOrganises => {
            teamNameAry = [];
            resultAry = [];
            gameIdAry = [];
            goiIdAry = [];
            teamIdAry = [];
            gameNameAry = [];
            studentsIdAry = [];
            totalTeamParticipantAry = [];
            var gameOrganizeYearArray = Array();
            var gameOrganizeGenderArray = Array();
            var done = 0;
            var flag = 0;
            var arrayLength = 0;
            for (var i = 0; i < gameOrganises.length; i++) {
                done++;
                Team.find({gameOrganizedId: gameOrganises[i]["_id"]}, function (err, teams) {
                    if (err) console.log("Teams find krva ma error avi " + err);
                    teamNameAry.push(teams[0]["teamName"]);
                });
                var goid=gameOrganises[i]["_id"];
                Result.find({gameOrganizedId: goid}, function (err, resutls) {

                    if (err) console.log("Results find krvama error avi " + err);
                    if (resutls) {
                        arrayLength++;
                        console.log("Game organized "+goid);
                    }
                });
                console.log("Here avi gyo complete ");
                if(done===gameOrganises.length){
                    console.log("Done ni value "+done);
                    done=0;
                    for (var j = 0; j < arrayLength; j++) {
                        console.log("Here avi gyo second for loop");
                        done++;
                        console.log("gameOrganises " + j + " " + gameOrganises[j]["_id"]);
                        goiIdAry.push([gameOrganises[j]["_id"], gameOrganises[j]["gameId"], gameOrganises[j]["gender"]]);
                        goiIdAry[j][3] = gameOrganises[j]["gameOrganizeYear"];
                        goiIdAry[j][4] = "";
                        if (done === arrayLength) {
                            flag = 1;
                        }
                    }
                    if (flag === 1) {
                        getGameNameForResult(goiIdAry).then(result => {

                            getTeamNameForResult(goiIdAry).then(teamresult => {
                                getResultDataForResult(goiIdAry).then(resultData => {
                                    done = 0;
                                    for (var i = 0; i < goiIdAry.length; i++) {
                                        done++;
                                        goiIdAry[i][4] = result[i];
                                        goiIdAry[i][5] = teamresult[i];
                                        goiIdAry[i][6] = resultData[i];
                                        if (done === goiIdAry.length) {
                                            res.json({
                                                success: true,
                                                msg: "Ha success thai gyu",
                                                goiIdArray: goiIdAry,
                                                teamNameAry: teamNameAry
                                            })
                                        }
                                    }
                                }).catch(reason => {
                                    res.json({
                                        success: true,
                                        msg: "Fail thai gyu result Data ma " + reason,
                                    })
                                })

                            }).catch(reason => {
                                res.json({
                                    success: true,
                                    msg: "Fail thai gyu teamsData ma " + reason,
                                })
                            });
                            // res.json({
                            //     success: true,
                            //     msg: "Success",
                            //     teamNameAry: teamNameAry
                            // });
                        }).catch(reason => {
                            console.log("Error " + reason.message);
                        });
                    }
                }
            }
            // console.log("Here avi gyo and arrayLength " + arrayLength);
            // if (arrayLength === 0) {
            //     res.json({
            //         msg: "No data found",
            //         teamNameAry: teamNameAry
            //     });
            // }
            // else {
            //
            // }
        }).catch(err => {
            res.json({
                success: true,
                msg: "Error while retriving data"
            });
        })
    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});

async function getGameNameForResult(goiIdAry) {
    let promise = new Promise((resolve, reject) => {
        async.forEach(goiIdAry, function process(item, next) {
            console.log("Item array " + item);
            Game.findById(item[1], function (err, games) {
                if (err) {
                    console.log("Games error " + err);
                }
                // console.log("Games is " + games);
                gameName = games["gameName"];
                gameNameAry.push(gameName);
                next();
            });
            // next();
        }, function allDone() {
            console.log(gameNameAry);
            resolve(gameNameAry);
        });
    });
    let gameresult = await promise;
    return gameresult;
}


async function getTeamNameForResult(goiIdAry) {
    let promise = new Promise((resolve, reject) => {
        async.forEach(goiIdAry, function process(item, next) {
            console.log("Item array " + item[0]);
            Team.find({gameOrganizedId: item[0]}).then(teams => {
                for (var i = 0; i < teams.length; i++) {
                    tempTeamId = teams[i];
                    teamNameAry.push(tempTeamId["teamName"]);
                    console.log("teams for " + tempTeamId["teamName"]);
                }
                next();
            }).catch(err => {
                console.log("Error " + err);
            });
        }, function allDone() {
            console.log(teamNameAry);
            resolve(teamNameAry);
        });
    });
    let teamresult = await promise;
    return teamresult;
}


async function getResultDataForResult(goiIdAry) {
    let promise = new Promise((resolve, reject) => {
        async.forEach(goiIdAry, function process(item, next) {
            console.log("Item array " + item[0]);
            Result.find({gameOrganizedId: item[0]}).then(results => {
                for (var i = 0; i < results.length; i++) {
                    tempResultId = results[i];
                    resultAry.push(tempResultId["resultType"]);
                    console.log("results for " + tempResultId["resultType"]);
                }
                next();
            }).catch(err => {
                console.log("Error " + err);
            });
        }, function allDone() {
            console.log(resultAry);
            resolve(resultAry);
        });
    });
    let result = await promise;
    return result;
}

router.post('/instituteResultTeamAddAjax', function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        var gender = req.body.gender;
        Game.find({gameName: req.body.gameName}, function (err, docs) {
            if (!err) {
                var gameId = docs[0]._id;
                console.log("Game Id " + gameId);
                GameOrganize.find({gameId: gameId, gender: gender}, function (err, gameOrganize) {
                    if (!err) {
                        var goId = gameOrganize[0]._id;
                        console.log("GoID " + goId);
                        var teamName = req.body.teamName;
                        Team.find({teamName: teamName}, function (err, teams) {
                            if (!err) {
                                var teamId = teams[0]._id;
                                var result = new Result();
                                result.gameOrganizedId = goId;
                                result.teamId = teamId;
                                result.resultType = req.body.resultType;
                                result.save((err, results) => {
                                    if (!err) {
                                        res.json({
                                            success: true,
                                            msg: "Successfully result created",
                                        });
                                    }
                                    else {
                                        res.json({
                                            success: true,
                                            msg: "Failed to create the result",
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});
// function getTeamNameForResult(gameOrganisesId,callback){
//     teamNameAry=[];
//     process.nextTick(function () {
//        callback(null,Team.find({gameOrganizedId:gameOrganisesId}).then(teams=>{
//            teamNameAry.push(teams[0]["teamName"]);
//            console.log("Teams "+teamNameAry);
//        }))
//     });
//
// }



router.get('/changePassword', function(req, res, next) {
    // res.render('Admin/index', { title: 'temp | Admin',layout:"masterLayout" });
    res.render('Institute/changePassword',{title:'BMIIT | Sports'});
});
router.post('/changePasswordAjax',function (req, res, next) {
    var id = req.session['userId'];
    if (id != null) {
        var new_Password=req.body.new_password;
        Institute.findById(id,function (err, institues) {
           institues.institutePassword=bcrypt.hashSync(new_Password, 8);
           institues.save((err,docs)=>{
               if(err) console.log("Change password krvama error avi "+err);
               res.json({
                   success:true,
                   msg:"Password successfully changed"
               });
           })
        });
    }
    else {
        res.json({
            msg: "Session Expired"
        });
    }
});
module.exports = router;