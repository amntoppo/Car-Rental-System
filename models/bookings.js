var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    carid: {type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true},
    userid: {type: mongoose.Schema.Types.ObjectId, ref: "userData", required: true},
    bookedBy: {type: String},
    from: {type: Date, required: true},
    to: {type: Date, required: true},
    pickup: {type: String, required: true},
    drop: {type: String, required: true},
    totalprice:{type: Number, required: true},
    active: {type: Boolean, default: true},
    finished: {type: Boolean, default: false}
}, {
    timestamps: true
});
//active status = 0, cancelled status = 1, finished status = 2
module.exports = mongoose.model('CarBookings', schema);