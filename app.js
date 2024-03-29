var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Grid = require("gridfs-stream");

var expresshbs = require('express-handlebars');
var mongoose = require("mongoose");
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var flash = require('connect-flash');
var passport = require('passport');
var validator = require('express-validator');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
const upload = require("./routes/upload");
require('./config/passport');

var admins = require('./config/admins');

var app = express();


let gfs;
//mongoose setup
mongoose.connect('mongodb://localhost:27017/car_rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.once('open', () => {
  gfs = Grid(db.db, mongoose.mongo);
    gfs.collection("photos");
  console.log("we are connected to database");
})
app.use("/file", upload)
app.get("/file/:filename", async (req, res) => {
  try {
      const file = await gfs.files.findOne({ filename: req.params.filename });
      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);
  } catch (error) {
      res.send("not found");
  }
});

app.delete("/file/:filename", async (req, res) => {
  try {
      await gfs.files.deleteOne({ filename: req.params.filename });
      res.send("success");
  } catch (error) {
      console.log(error);
      res.send("An error occured.");
  }
});

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
  if(req.user) {
      if(admins.indexOf(req.user.mobile) !== -1) {
        res.locals.isadmin = true;
      }
      else {
        res.locals.isadmin = false;
      }
  }
  
  if(req.user) {
    res.locals.verified = req.user.verified;
    
  }
  //res.locals.isadmin = res.locals.isadmin ? res.locals.isadmin : false;

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
