require('./models/db');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
var session=require('express-session');

//initilize your router here
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var instituteRouter=require('./routes/institute');


var app = express();

// view engine setup
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({defaultLayout: 'masterLayout', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:"sshhhss",resave:false,saveUninitialized:true}));
app.use(express.static(path.join(__dirname, 'public')));


//use your router here
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/institute',instituteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
