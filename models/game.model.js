const mongoose=require('mongoose');
var gameSchema=new mongoose.Schema({
    gameName:{
        type:String
    },
    gameType:{
        type:Boolean
    },
    gameDescription:{
        type:String
    },
    gameTeamType:{
        type:Boolean
    }
});
var Game=mongoose.model('Game',gameSchema);
module.exports=Game;