var express = require('express');
var router = express.Router();
const User = require('../models/user');

//authentication and session
var csurf = require('csurf');
var passport = require('passport');
var flash = require('connect-flash');


var csurfProtection = csurf();
router.use(csurfProtection);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', (req, res, next) => {
  User.findById(req.user._id, (err, data) => {
    res.render('user/profile', {name: data.name, license: data.license, mobile: data.mobile, verified: data.verified});
  });
  
});

router.get('/editprofile', (req, res, next) => {
  res.render('user/editprofile', {csurfToken: req.csrfToken()});
});

router.post('/updateprofile', isLoggedIn, (req, res, next) => {
  var id = req.user;
  var mobile = req.body.mobile;
  var name = req.body.name;
  var license = req.body.license;
  User.findById(id, (err, data) => {
      //data.mobile = mobile;
      data.name = name;
      data.license = license;
      //doc.markModified('mobile');
      data.markModified('name');
      data.markModified('license');
      data.save((err, doc) => {
        res.redirect('/user/profile');
      });

  })
})

router.get('/signup', (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signup', {csurfToken: req.csrfToken(), messages: messages, hasError: messages.length > 0});
});

router.get('/signin', (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signin', {csurfToken: req.csrfToken(), messages: messages, hasError: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/',
    failureRedirect: '/user/signup',
    failureFlash: true
}));
router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
}

module.exports = router;
