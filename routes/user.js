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
  successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));
router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));
module.exports = router;
