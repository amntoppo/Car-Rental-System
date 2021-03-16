var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', (req, res, next) => {
  res.render('user/signup');
});

router.get('/signin', (req, res, next) => {
  res.render('user/signin');
});
module.exports = router;
