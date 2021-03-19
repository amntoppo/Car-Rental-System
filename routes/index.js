var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Car = require('../models/car');
var Booking = require('../models/bookings');
//const bookings = require('../models/bookings');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  //console.log(req.user.mobile);
  var cars = Car.find((err, data) => {
    // if(data.currentBooking && data.currentBooking > toTimestamp(new Date())) {
    //   data.available = false;
    //   data.save((error, output) => {
    //     //console.log(data)
    //     res.render('index', {data: data});
    //   });
    // }
    // else {
    //   if(data.available == false) {
    //     data.available = true;
    //     dava.save((error, output) => {
    //       //console.log(data)
    //       res.render('index', {data: data});
    //     });
    //   }
    //   else {
    //     //console.log(data);
    //     res.render('index', {data: data});
        
    //   }
    // }
    // if(data.currentBooking > new Date()) {
    //   data.available = false;
    //   data.save((error, output) => {

    //   })
    // }
    // else {
    //   data.available = true;
    //   data.save((error, outputt) => {
    //     console.log(error);
    //   });
      
    // }
    
    
    res.render('index', {data: data})
  }).lean();
});

router.get('/users', (req, res, next) => {
  res.render('/userlist');
})
router.post('/searchcars', (req, res, next) => {
  var carArray = [];
  var carIdArray =[];
  var searchdatetime = req.body.searchdatetimes;
  var spliteddatetime = searchdatetime.split(" - ")
  // Car.find({'currentBooking': {$lt: toTimestamp(spliteddatetime[0])}}, (err, data) => {
  //   res.render('index', {data: data});
  // }).lean();

  
  // // })
  Car.find((err, carData) => {
    //console.log(carData);
      //carArray = carData;
      
  }).then(elem => {
    elem.forEach(elem => {
      carIdArray.push(String(elem._id));
    })
    console.log(carIdArray);
  })

  

  // });
  // Car.find({}).select('_id').exec((err, data) => {
  //   carIdArray = data;
  // })
//   console.log(carIdArray);

//     Booking.find({'from': {$gte: toTimestamp(spliteddatetime[0])},
// 'to': {$lt: toTimestamp(spliteddatetime[1])}}).populate('Car')
// .exec((err, data) => {
//   console.log(data);
// })
// Booking.find({}).populate('Car')
// .exec((err, data) => {
//   console.log(data.Car.model);
// })

// 'from': {$gte: toTimestamp(spliteddatetime[0])},
// 'to': {$lt: toTimestamp(spliteddatetime[1])}}

// Booking.find()
// .populate('carid')
// .exec()
// .then(data => {
//   console.log(data.carid.manufacturer);
// })
//, $lt: toTimestamp(spliteddatetime[1])
Booking.find({'from': {$gte: spliteddatetime[0]}})
.exec()
.then(data => {
  console.log(data);
  data.forEach(bookingData => {
    if(carIdArray.includes(String(bookingData.carid))) {
     
      carIdArray.splice(carIdArray.indexOf(String(bookingData.carid)), 1);
    }
    
  })
  console.log(carIdArray)
  Car.find().where('_id').in(carIdArray).lean(true).exec((err, records) => {
    
    res.render('car/search', {data: records});
  });
})

  //Car.find().populate('_id')
  
//   Booking.find({'from': {$gte: toTimestamp(spliteddatetime[0])},
// 'to': {$lt: toTimestamp(toTimestamp[1])}}, 
//   (err, data) => {
//     //console.log(data.carid);
//     // if(carIdArray.find(data.cardid)) {
//     //   carIdArray.pop(data.carid);
//     // }
//     // for(var i=0; i < data.count(); i++) {
//     //   carIdArray.push(data[i].carid);
//     //   console.log(data[i].carid);
//     // }
// }).populate('carid').then(() => {
//   console.log(data);
//   Car.find({_id: {$in: carIdArray}}, (err, output) => {
//     res.render('index', {data: output});
//   })
// })
// var query = Booking.find({});
// query.where('from').gte(toTimestamp(spliteddatetime[0]));
// query.where('to').lt(toTimestamp(spliteddatetime[1]));
// //query.populate('carid');
// query.exec((error, outp) => {
//   console.log(outp);
// })

   
})

router.get('/cars', (req, res, next) => {
  res.render('car/new_car');
});


router.get("/bookingdetails/:id", (req, res, next) => {
  var id = req.params.id;
  // Car.findById(id, (err, data) => {
    
  // })
  
  Booking.find({'carid' : id}, (err, data) => {

   


    console.log(data);
    res.render('car/details', {data: data});

  }).lean();

  
})
router.get('/search', (req, res, next) => {
  var datetime = req.body.datetimes;
  var spliteddatetime = datetime.split(" - ")

})

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
  var price = 0;
  //console.log(datetime);

  //set availability
  console.log(toTimestamp(spliteddatetime[0]));
  // if(toTimestamp(spliteddatetime[1]) > toTimestamp(new Date())) {
  //   Car.findById(id,(erro, doc) => {
  //     doc.available = false;
  //     doc.currentBooking = toTimestamp(spliteddatetime[1]);
  //     console.log(toTimestamp(spliteddatetime[1]));
  //     doc.save();
  //   })
  // }
  // else {
  //   Car.findById(id, (erro, doc) => {
  //     doc.available = true;
  //     doc.currentBooking = toTimestamp(spliteddatetime[1]);
  //     console.log(toTimestamp(spliteddatetime[1]));
  //     doc.save();
  //   })
  // }
  Car.findById(id,(erro, doc) => {
    // if(toTimestamp(spliteddatetime[1]) > toTimestamp(new Date())) {
    //   doc.available = false;
    //   doc.currentBooking = toTimestamp(spliteddatetime[1]);
      
    // }
    // else {
    //   doc.available = true;
    //   doc.currentBooking = toTimestamp(spliteddatetime[1]);
      
    // }
    
    //var totalhours = diff_hours(spliteddatetime[0], spliteddatetime[1]);
    var totalhours = (toTimestamp(spliteddatetime[1]) -  toTimestamp(spliteddatetime[0]))/36e2;
    console.log(totalhours);
    totalprice = doc.security + doc.baseprice + (totalhours * doc.pph);
    var booking = new Booking({
      carid: id,
      userid: req.user._id,
      bookedBy: req.user.mobile,
      from: spliteddatetime[0],
      to: spliteddatetime[1],
      totalprice: totalprice,
    });
    booking.save((err, output) => {
      if(err) {
        console.log(err);
      }
      else {
        console.log("prev: + " + toTimestamp(spliteddatetime[1]));
        console.log("current:" + toTimestamp(new Date()));
        
        console.log("Car created");
        res.redirect('/');
      }
    })
    doc.save();
  })


  
});

function diff_hours(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
  
 }
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
      res.redirect('/');
    }
  })
});

module.exports = router;
