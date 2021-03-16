var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    carlicensenumber: {type: String, required: true},
    manufacturer: {type: String, required: true},
    model: {type: String, required:true},
    baseprice: {type: Number, required: true},
    pph: {type: Number, required: true},
    security:{type: Number, required: true}
});

module.exports = mongoose.model('Car', schema);