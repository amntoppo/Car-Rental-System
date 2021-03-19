var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var expresshbs = require('express-handlebars');
var mongoose = require("mongoose");
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var flash = require('connect-flash');
var passport = require('passport');
var validator = require('express-validator');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
require('./config/passport');

var app = express();


//mongoose setup
mongoose.connect('mongodb+srv://dbUser:dbuserpassword@cluster0.4vsa0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.once('open', () => {
  console.log("we are connected to database");
})

// view engine setup
app.engine('hbs', expresshbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'carrentalsession',
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({mongooseConnection: db}),
    cookie: {maxAge: 180 * 60 * 1000}
}));


app.use(passport.initialize());
app.use(passport.session());
//app.use(validator());
app.use(flash());

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated(); 
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/user', usersRouter);

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
