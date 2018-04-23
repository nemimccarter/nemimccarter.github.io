var cookieSession = require('cookie-session')
var express = require('express');

var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var terms = require('./routes/terms');
var about = require('./routes/about');
var aboutMember = require('./routes/aboutMember');
var users = require('./routes/users');
var search = require('./routes/search');
var listings = require('./routes/listings');
// var filter = require('./routes/filter');
var listing = require('./routes/listing');
var dashboard = require('./routes/dashboard');
var messageBoard = require('./routes/messageBoard');
var sendMsg = require('./routes/sendMsg');
var sendMessages = require('./routes/sendMessages');
var getMessages = require('./routes/getMessages');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signup = require('./routes/signup');
var models = require('./models');
var user  = require('./models/user.js');
var adminDashboard = require('./routes/adminDashboard');
var errorPage = require('./routes/error');
var app = express();
var passport = require('passport');


// create sequelize object
var Sequelize = require('sequelize');

// set up sequelize config
// var sequelize = new Sequelize('csc648_m2_development', 'root', '', {
var sequelize = new Sequelize('fa17g09', 'fa17g09', 'csc648fa17g09', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

//Checking connection status
var test = sequelize.authenticate()
    .then(function () {
        console.log("CONNECTED!");
    })
    .catch(function (err) {
        console.log("LORD HELP ME I CAN'T REACH THE DATABASE!");
    })
    .done();

var auth  = require('./config/auth.js')(app, models);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(expressLayouts);

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser('MySecret'));
app.use(cookieSession({
  key    : 'MySecret',
  secret : 'MySecret',
  cookie : {
    maxAge: 300000000
  }
}));

app.use('/', index);
app.use('/terms', terms);
app.use('/about', about);
app.use('/aboutMember', aboutMember);

app.use('/users', users);
app.use('/search', search);
app.use('/listings', listings);
// app.use('/filter', filter);
app.use('/listing', listing);
app.use('/dashboard', dashboard);

app.use('/messageBoard', messageBoard);
app.use('/sendMsg', sendMsg);

app.use('/sendMessages', sendMessages);
app.use('/getMessages', getMessages);

app.use('/login', login);
app.use('/logout', logout);
app.use('/signup', signup);
app.use('/adminDashboard', adminDashboard);
app.use('./errorPage', errorPage);

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

var fa17g09_env_prefix = require('./prefix');

app.locals.fa17g09_env_prefix = fa17g09_env_prefix;
console.log('Running using ' + app.get('env') + ' profile.');

module.exports = app;
