var passport = require('passport');
var User = require('../models/user');
var localStrategy = require('passport-local').Strategy;
const { body, validationResult } = require('express-validator');

passport.serializeUser(function (user, done) {
  done(null, user.id)
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local.signup', new localStrategy({
  usernameField: 'mobile',
  passportField:'password',
  passReqToCallback: true
},
  function(req, mobile, password, done) {
    //req.checkBody('mobile', 'Invalid mobile').notEmpty().isLength(10);
    body('mobile').isMobilePhone();
    body('password').isLength({min:4});
    //req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      var messages = [];
      //errors.forEach(function (error) {
       // messages.push(error.msg);
        messages = errors.array();
      ///});
      return done(null, false, req.flash('error', messages));

    }
    User.findOne({'mobile' : mobile}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, {message: 'mobile is already in use'});
      }
      var newUser = new User() ;
      newUser.mobile = mobile;
      newUser.license = req.body.license;
      newUser.name = req.body.name;
      newUser.password = newUser.encryptPassword(password);
      newUser.save(function(err, result) {
        if (err) {
          // console.log('error');
          return done(err);
        }
        else {
          // console.log('no error');
          console.log(newUser);
          return done(null, newUser);
        }
      });
    });
  }));

  passport.use('local.signin', new localStrategy({
    usernameField: 'mobile',
    passwordField: 'password',
    passReqToCallback: true
  },
    function(req, mobile, password, done) {
        body('mobile').isMobilePhone();
         body('password').isLength({min:4});
         console.log("signni check");
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            var messages = [];
            console.log("signni check 2");
            // console.log(errors);
            // messages = errors.array();
            messages = errors.array();
            return done(null, false, req.flash('error', messages));
        }
        User.findOne({'mobile' : mobile}, function(err, user) {
            if (err) {
                console.log("signni check 3");
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'No user found with this mobile'});
            }
            if (!user.validPassword(password)) {
              return done(null, false, {message: 'Wrong password'});
            }
            return done(null, user);
      });
    }
));