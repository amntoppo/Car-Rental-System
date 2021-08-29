var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    carlicensenumber: {type: String, required: true},
    manufacturer: {type: String, required: true},
    model: {type: String, required:true},
    category: {type: String, required: false},
    chesis: {type: String, required: false},
    baseprice: {type: Number, required: true},
    pph: {type: Number, required: true},
    security:{type: Number, required: true},
    available:{type: Boolean, default: true},
    currentBooking:{type: Date, default: Date.now},
    img:
    {
        data: Buffer,
        contentType: String
    }
});


module.exports = mongoose.model('Car', schema);