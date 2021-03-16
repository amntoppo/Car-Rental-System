var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Car = require('../models/car');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/cars', (req, res, next) => {
  res.render('car/new_car');
});

router.get('/cars/list', (req, res, next) => {
  var cars = Car.find((err, data) => {
    res.render('car/list', {data: data});
  }).lean();
  
});
router.get('/cars/booking', (req, res, next) => {
  
});

router.post('/create_car', (req, res, next) => {
  var newCar = new Car({
    carlicensenumber: req.body.car_license_number,
    manufacturer: req.body.manufacturer,
    model: req.body.model,
    baseprice: req.body.base_price,
    pph: req.body.pph,
    security: req.body.security
  });
  newCar.save((err, output) => {
    if(err) {
      console.log(err);
    }
    else {
      console.log("Car created");
      res.redirect('/cars/list');
    }
  })
});

module.exports = router;
