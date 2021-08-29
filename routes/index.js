var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Car = require('../models/car');
var Booking = require('../models/bookings');
const user = require('../models/user');
var fs = require('fs');
var path = require('path');
const multer = require("multer");
const { countDocuments } = require('../models/car');


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../carimage/'))
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {

  var cars = Car.find((err, data) => {
    if(err) {
      console.log(err);
    }
    else {
    var verified = res.locals.verified;
    var temp = data;
    temp.forEach(element => {
      if(element.img) {
        element.hasimage = true;
        element.datastring = element.img.data.toString('base64');
      }
      else {
        element.hasimage = false;
      }
    });
    console.log(verified);
    res.render('index', {data: data, isLogin: req.isAuthenticated(), verified: verified})
    }
  }).lean();
});

router.get('/productdetail/:id', (req, res, next) => {
  var id = req.params.id;
  Car.findById(id, (err, data) => {
    if(err) {
      console.log(err);
    }
      if(data.img) {
        data.hasimage = true;
        data.datastring = data.img.data.toString('base64');
      }
      else {
        data.hasimage = false;
      }
    
    res.render('productdetail', {data: data});
  }).lean();
  
})

router.get('/policy', (req, res, next) => {
  res.render('policy');
});

router.get('/users', (req, res, next) => {
  res.render('usersecurity');
  
  
})

router.post('/bookings/:id', (req, res, next) => {
  var id = req.params.id;
  var fromadmin = true;
  var nobookings = true;
Booking.find({'userid':id}).populate('carid').populate('userid').lean(true).exec().then(doc => {
  if (doc.length) {
    nobookings = false;
  }
  else {
    nobookings = true;
  }
  console.log(nobookings);
  res.render('userbookings', {data: doc, nobookings: nobookings, fromadmin: fromadmin})
})
})

router.get('/bookingstatus/:status/:id', (req, res, next) => {
  var status = req.params.status;
  var id = req.params.id;
  console.log(req.params.status + req.params.id);

  Booking.findById(id, (err, data) => {
    if(status == "active") {
      data.active = true
      data.finished = false;
    }
    else if(status == "cancel") {
      data.active = false;
      data.finished = false;
    }
    else if(status == "finished") {
      data.active = false;
      data.finished = true;
    }
    data.markModified('active');
    data.markModified('finished');
    data.save((err, doc) => {
      Booking.find({'userid':doc.userid}).populate('carid').populate('userid').lean(true).exec().then(doc => {
        res.render('userbookings', {data: doc})
      })
    })

  })
  
});
router.get('/userbookingstatus/:status/:id', (req, res, next) => {
  var status = req.params.status;
  var id = req.params.id;
  console.log(req.params.status + req.params.id);

  Booking.findById(id, (err, data) => {
    if(status == "active") {
      data.active = true
      data.finished = false;
    }
    else if(status == "cancel") {
      data.active = false;
      data.finished = false;
    }
    else if(status == "finished") {
      data.active = false;
      data.finished = true;
    }
    data.markModified('active');
    data.markModified('finished');
    data.save((err, doc) => {
      Booking.find({'userid':doc.userid}).populate('carid').populate('userid').lean(true).exec().then(doc => {
        res.render('user/mybookings', {data: doc})
      })
    })

  })
  
});



router.post('/searchcar', (req, res, next) => {
  var searchquery = req.body.carsearch;
    var regex = new RegExp(searchquery, 'i');

  Car.find().or([
    // {mobile: searchquery.isNumberic() ? searchquery: ''},
    {model: regex},
    {carlicensenumber: regex},
    {manufacturer: regex},
    {category: regex},
    {chesis: regex}
  ])
  .lean(true)
  .exec()
  .then(data => {
    console.log(data);
    res.render('admin/admin_car_list', {data: data})
  })


})

router.get('/cars', (req, res, next) => {
  res.render('security');
});


router.get("/bookingdetails/:id", (req, res, next) => {
  var id = req.params.id;
  var nobookings = true;
  Booking.find({'carid' : id}, (err, data) => {
    if (data.length) {
      nobookings = false;
    }
    else {
      nobookings = true;
    }
    res.render('car/details', {data: data, nobookings: nobookings});

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
        res.render('car/bookingconfirm', {manufacturer: doc.manufacturer, model: doc.model, totalprice: totalprice, from: spliteddatetime[0], to:spliteddatetime[1], pickup: pickuplocation, drop: droplocation, pph: totalhours * doc.pph, security: doc.security, baseprice: doc.baseprice, totalhours: totalhours});
        
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

router.post('/create_car',upload.single('image'), async (req, res) => {
  var filesync = fs.readFileSync(path.join(__dirname, '../carimage/' + req.file.filename));
  var newCar = new Car({
    carlicensenumber: req.body.car_license_number,
    manufacturer: req.body.manufacturer,
    model: req.body.model,
    category: req.body.categorypick,
    chesis: req.body.chesis,
    baseprice: req.body.base_price,
    pph: req.body.pph,
    security: req.body.security,
    img : {
      data: filesync,
      contentType: 'image/png'
  }
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
  console.log("isadmin" + res.locals.isadmin);
  if(res.locals.isadmin == true) {
    res.render('admin/adminpage');
  }
  else {
  res.redirect('/');
  }
});

// router.post('/adminpanel', (req, res, next) => {
//   var pass = req.body.password;
//   if(pass == "admin") {
//       res.locals.isadmin = true;
//       console.log("isadmin" + res.locals.isadmin);
//       res.render('admin/adminpage');
    
//   }
// });

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

router.post('/searchuser', (req, res, next) => {
  var searchquery = req.body.usersearch;

  var regex = new RegExp(searchquery, 'i');

  user.find().or([
    // {mobile: searchquery.isNumberic() ? searchquery: ''},
    {license: regex},
    {name: regex}
  ])
  .lean(true)
  .exec()
  .then(data => {
    console.log(data);
    res.render('user/userlist', {data: data})
  })
})

router.get('/categoryfilter/:id', (req, res, next) => {
  console.log(req.params.id);
  var verified = res.locals.verified;
  var cars = Car.find({category: req.params.id}, (err, data) => {
    
    res.render('index', {data: data, isLogin: req.isAuthenticated(), verified: verified})
  }).lean();
  
});




router.get('/verifylicense', (req, res, next) => {
  user.find({verified: false}, (err, data) => {
    //console.log(data);

    var temp = data;
    var nouser = true;
    temp.forEach(element => {
      if(element.img) {
        element.datastring = element.img.data.toString('base64');
      }
      
    });
    if (data.length) {
      nouser = false;
    }
    else {
      data = true;
    }
    
    res.render('admin/verify', {data: data, nouser: nouser});
  }).lean();
})

router.post('/acceptverification/:id', (req, res, next) => {
  var id = req.params.id;
  user.findByIdAndUpdate(id, {verified: true}, (err, docs) => {
    if(err) {
      console.log(err)
    }
    else {
      res.redirect('/verifylicense');
      console.log(docs);
    }
  })
})

router.post('/rejectverification/:id', (req, res, next) => {
  var id = req.params.id;
  user.findByIdAndUpdate(id, {verified: null}, (err, docs) => {
    if(err) {
      console.log(err)
    }
    else {
      res.redirect('/verifylicense');
      console.log(docs);
    }
  })
})

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
  var id = req.user;
  var nobookings = true;
  console.log(id.mobile);
Booking.find({'userid':id}).populate('carid').populate('userid').lean(true).exec().then(doc => {
  if (doc.length) {
    nobookings = false;
  }
  else {
    nobookings = true;
  }
  console.log(nobookings);
  res.render('user/mybookings', {data: doc, nobookings: nobookings})
})
})

module.exports = router;
