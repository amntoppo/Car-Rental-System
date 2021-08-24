var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Car = require('../models/car');
var Booking = require('../models/bookings');
const user = require('../models/user');
const { countDocuments } = require('../models/car');

/* GET home page. */
router.get('/', function(req, res, next) {

  var cars = Car.find((err, data) => {
    
    res.render('index', {data: data, isLogin: req.isAuthenticated()})
  }).lean();
});

router.get('/users', (req, res, next) => {
  res.render('usersecurity');
  
  
})

router.post('/bookings/:id', (req, res, next) => {
  var id = req.params.id;
  var bookingArray = [];
Booking.find({'userid':id}).populate('carid').populate('userid').lean(true).exec().then(doc => {
  console.log(doc);
  res.render('userbookings', {data: doc})
})
})


router.post('/searchcars', (req, res, next) => {
  var carArray = [];
  var carIdArray =[];
  var searchdatetime = req.body.searchdatetimes;
  var spliteddatetime = searchdatetime.split(" - ")
  

Booking.find().or([
  {$and: [{'from': {$gte: spliteddatetime[0]}}, {'to': {$gte: spliteddatetime[1]}}] },
  {$and: [{'from': {$lt: spliteddatetime[0]}}, {'to' : {$lt: spliteddatetime[1]}}] }
])
.populate('carid')
.lean(true)
.exec()
.then(data => {
  res.render('car/search', {data: data})
})
})

router.get('/cars', (req, res, next) => {
  res.render('security');
});


router.get("/bookingdetails/:id", (req, res, next) => {
  var id = req.params.id;
 
  Booking.find({'carid' : id}, (err, data) => {
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

// router.post('/cars/book/:id', (req, res, next) => {
//   var id = req.params.id;
//   var datetime = req.body.datetimes;
//   var spliteddatetime = datetime.split(" - ")
//   var price = 0;
//   Car.findById(id,(erro, doc) => {
   
//     var totalhours = (toTimestamp(spliteddatetime[1]) -  toTimestamp(spliteddatetime[0]))/36e2;
//     console.log(totalhours);
//     totalprice = doc.security + doc.baseprice + (totalhours * doc.pph);
//     var booking = new Booking({
//       carid: id,
//       userid: req.user._id,
//       bookedBy: req.user.mobile,
//       from: spliteddatetime[0],
//       to: spliteddatetime[1],
//       totalprice: totalprice,
//     });
//     booking.save((err, output) => {
//       if(err) {
//         console.log(err);
//       }
//       else {
//         console.log("prev: + " + toTimestamp(spliteddatetime[1]));
//         console.log("current:" + toTimestamp(new Date()));
        
//         console.log("Car created");
//         //res.redirect('/');
//         res.render('car/bookingconfirm', {manufacturer: doc.manufacturer, model: doc.model, totalprice: totalprice, from: spliteddatetime[0], to:spliteddatetime[1]});
        
//       }
//     })
//   })
// });

router.post('/cars/book/:id', (req, res, next) => {
  var id = req.params.id;
  //var duration = req.body.durationpick;
  var pickuplocation = req.body.pickuppick;
  var droplocation = req.body.dropick;


  var datetime = req.body.datetimes;
  var spliteddatetime = datetime.split(" - ")
  var price = 0;
  Car.findById(id,(erro, doc) => {  
    var totalhours = (toTimestamp(spliteddatetime[1]) -  toTimestamp(spliteddatetime[0]))/36e2;
    console.log(totalhours);
    totalprice = doc.security + doc.baseprice + (totalhours * doc.pph);
    var booking = new Booking({
      carid: id,
      userid: req.user._id,
      bookedBy: req.user.mobile,
      from: spliteddatetime[0],
      to: spliteddatetime[1],
      pickup: pickuplocation,
      drop: droplocation,
      totalprice: totalprice,
    });
    booking.save((err, output) => {
      if(err) {
        console.log(err);
      }
      else {
        doc.available = false;
        doc.markModified('available');
        console.log("prev: + " + toTimestamp(spliteddatetime[1]));
        console.log("current:" + toTimestamp(new Date()));
        
        console.log("Bookling done");
        //res.redirect('/');
        doc.save((err, carresult) => {
          if(err) {
            console.log(err);
          }
          else {
            console.log(carresult);
          }
         });
        res.render('car/bookingconfirm', {manufacturer: doc.manufacturer, model: doc.model, totalprice: totalprice, from: spliteddatetime[0], to:spliteddatetime[1]});
        
      }
    })
  })
});
router.get('/bookingconfirm/:id', (req, res, next) => {
  var id = req.params.id;
  Booking.findById(id, (err, data) => {
    res.render('')
  })

})


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
    category: req.body.categorypick,
    chesis: req.body.chesis,
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
      res.redirect('/admincarlist');
    }
  })
});

router.get('/newcar', (req, res, next) => {
    res.render('car/new_car');
});

router.post('/checkuser', (req, res, next) => {
  var pass = req.body.password;
  //console.log(pass);
  if (pass == "admin") {
    user.find((err, data) => {
      res.render('user/userlist', {data: data});
    }).lean();
  }
  else {
    res.redirect('/');
  }
});

router.get('/admin', (req, res, next) => {
  res.render('admin');
});

router.post('/adminpanel', (req, res, next) => {
  var pass = req.body.password;
  if(pass == "admin") {
  
      res.render('admin/adminpage');
    
  }
});

router.get('/admincarlist', (req, res, next) => {
  var cars = Car.find((err, data) => {
    res.render('admin/admin_car_list', {data: data});
  }).lean();
});

router.get('/removecar/:id', (req, res, next) => {
  var id = req.params.id;
  Car.findByIdAndDelete(id, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("deleted: " + result);
      
      var cars = Car.find((err, data) => {
        res.render('admin/admin_car_list', {data: data});
      }).lean();
      
    }
  })
});

router.get('/adminuserlist', (req, res, next) => {
  user.find((err, data) => {
    res.render('user/userlist', {data: data});
  }).lean();
});

router.get('/categoryfilter/:id', (req, res, next) => {
  console.log(req.params.id);
  var cars = Car.find({category: req.params.id}, (err, data) => {
    
    res.render('index', {data: data, isLogin: req.isAuthenticated()})
  }).lean();
  
});

router.get('/toggleavailable/:id', (req, res, next) => {
  var id = req.params.id;
  var cars = Car.findById(id, (err, data) => {
    data.available = data.available ? false : true;
    data.markModified('available');
    data.save((err, result) => {
      if(err) {
        console.log(err);
      }
      else {
        var cars = Car.find((err, data) => {
          res.render('admin/admin_car_list', {data: data});
        }).lean();
      }
    })
  })
})

router.get('/mybookings', (req, res, next) => {
  var bookingArray = [];
  var id = req.user;
Booking.find({'userid':id}).populate('carid').populate('userid').lean(true).exec().then(doc => {
  console.log(doc);
  res.render('userbookings', {data: doc})
})
})

module.exports = router;
