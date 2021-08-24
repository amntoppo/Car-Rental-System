var express = require('express');
var router = express.Router();

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
