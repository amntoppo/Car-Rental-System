const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");

const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/car_rental',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        //if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            //const filename = req.user._id;
            console.log(req);
            return filename;
        //}
            console.log(req);
            console.log(file);
        // return {
        //     bucketName: "photos",
        //     filename: `${Date.now()}-any-name-${file.originalname}`,
        // };
    },
});

// const tempstorage = new GridFsStorage({ url : 'mongodb://localhost:27017/license'});

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads')
        
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });
 
//var upload = multer({ storage: storage });


module.exports = multer({ storage });


