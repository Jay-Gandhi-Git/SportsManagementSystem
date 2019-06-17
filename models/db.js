const mongoose = require('mongoose');

var url = "mongodb://127.0.0.1:27017/SportsDB"; // SportsDB is the name of db
mongoose.connect(url, { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});
require('./admin.model');
require('./insitute.model');
require('./game.model');
require('./student.model');
require('./gameOrganized.model');
require('./Team.model');
require('./TeamParticipent.model');
require('./schedule.model');
require('./result.model');