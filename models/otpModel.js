const mongoose = require('mongoose');
const db = require('../config/dbConnection');

const otpSchema = new mongoose.Schema({
    email : {type : String , unique : true},
    otp : String,
    createdAt : Date,
    expiresAt : Date,
});

otpSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

module.exports = db.model('OTP', otpSchema);