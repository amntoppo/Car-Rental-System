var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Car = require('../models/car');
var Booking = require('../models/bookings');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  var cars = Car.find((err, data) => {
    res.render('index', {data: data});
  }).lean();
});

router.get('/cars', (req, res, next) => {
  res.render('car/new_car');
});

router.get('/cars/list', (req, res, next) => {
  var cars = Car.find((err, data) => {
    res.render('car/list', {data: data});
  }).lean();
  
});
// router.get('/cars/book/:id', (req, res, next) => {
//   var id = req.params.id;
    
// });

router.post('/cars/book/:id', (req, res, next) => {
  var id = req.params.id;
  var datetime = req.body.datetimes;
  var spliteddatetime = datetime.split(" - ")
  //console.log(datetime);
  console.log(toTimestamp(spliteddatetime[0]));
  var booking = new Booking({
    carid: id,
    userid: req.user._id,
    from: spliteddatetime[0],
    to: spliteddatetime[1],
    totalprice: 1000
  });
  booking.save((err, output) => {
    if(err) {
      console.log(err);
    }
    else {
      console.log("Car created");
      res.redirect('/');
    }
  })
});

  function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
   }

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
