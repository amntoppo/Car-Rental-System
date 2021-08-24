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
    totalprice:{type: Number, required: true}
}, {
    timestamps: true
});

module.exports = mongoose.model('CarBookings', schema);