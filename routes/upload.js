//const upload = require("../config/upload");
const express = require("express");
const multer = require("multer");
const router = express.Router();
var path = require('path');
var fs = require('fs');
const User = require('../models/user');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
 
var upload = multer({ storage: storage });

// router.post('/uploadlicense', upload.single('image'), async  (req, res) => {
//     const tempPath = req.file.path;
//     console.log("temp" + tempPath);
//       const targetPath = path.join(__dirname, "./uploads/image.png");
//       console.log("target" + targetPath);
  
//       if (path.extname(req.file.originalname).toLowerCase() === ".png") {
//         fs.rename(tempPath, targetPath, err => {
//           if (err) return console.log(err);
  
//           res
//             .status(200)
//             .contentType("text/plain")
//             .end("File uploaded!");
//         });
//       } else {
//         fs.unlink(tempPath, err => {
//           if (err) return handleError(err, res);
  
//           res
//             .status(403)
//             .contentType("text/plain")
//             .end("Only .png files are allowed!");
//         });
//       }


      router.post('/uploadlicense/:id', upload.single('image'), async (req, res) => {
    User.findById(req.params.id, (err, data) => {
        data.img = {
            data: fs.readFileSync(path.join(__dirname, '../uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
        data.verified = false;
        data.markModified('verified');
        data.markModified('img');

        
        var message = "Your license has been uploaded";
        data.save((err, output) => {
            if (err) console.log(err);
            else
            res.render('user/profile', {name: data.name, license: data.license, mobile: data.mobile, verified: data.verified, id: data._id, message: message});
        })
    })
    
    //return res.send(imgUrl);
  });
//   app.post(
//     "/upload",
//     upload.single("file" /* name attribute of <file> element in your form */),
//     (req, res) => {
//       const tempPath = req.file.path;
//       const targetPath = path.join(__dirname, "./uploads/image.png");
  
//       if (path.extname(req.file.originalname).toLowerCase() === ".png") {
//         fs.rename(tempPath, targetPath, err => {
//           if (err) return handleError(err, res);
  
//           res
//             .status(200)
//             .contentType("text/plain")
//             .end("File uploaded!");
//         });
//       } else {
//         fs.unlink(tempPath, err => {
//           if (err) return handleError(err, res);
  
//           res
//             .status(403)
//             .contentType("text/plain")
//             .end("Only .png files are allowed!");
//         });
//       }
//     }
//   );

  module.exports = router;