var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {Pool,Client} = require('pg');
var passport = require('passport');
var dotenv = require('dotenv');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// For fetching ENV Configuration File
dotenv.config();

// Express Body Parser for handling form data
app.use(express.urlencoded({ extended: true }));


// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  
});







console.log('process.env.DATABSE_URL'+process.env.DATABASE_URL);
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})
client.connect();
client.query('SELECT LastName From salesforce.contact ',(err,result)=>{
  if(err)
    return console.error('Error executing query', err.stack);
  console.log('Query Result Using  Client Class: '+result.rows[0].LastName);
  client.end();
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})
pool.query('SELECT Name From salesforce.account ',(err,result)=>{
  if(err)
    return console.error('Error executing query', err.stack);
  console.log('Query Result : '+result.rows[0]);
  var i=1;
  result.rows.forEach(function(singleRow){
    console.log('i '+i);
    console.log('Name : '+singleRow.Name);
    console.log(JSON.stringify(singleRow)); 
    i++;
  })
 
});

/*const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
}) */
//pool.connect();

pool.query('SELECT FirstName, LastName, Email, Password__c From salesforce.Contact ',(err,result)=>{
  if(err)
    return console.error('Error executing query', err.stack);
  console.log('Query Result : '+result.rows[0]);
  var i=1;
  result.rows.forEach(function(singleRow){
    console.log('i '+i);
    console.log('LastName : '+singleRow.LastName);
    console.log('Email  : '+singleRow.Email);
    console.log('Password  : '+singleRow.Password__c);
    i++;
  })
  pool.end();
});





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
