const mongoose = require('mongoose');
const db = require('../config/dbConnection');

const userSchema = new mongoose.Schema({
    username : { type : String , required : true , unique : true},
    email : { type : String , required : true , unique : true},
    password : { type : String , required : true },
    isVerified :{ type:  Boolean  , default:false},
    token : String
});

userSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });


module.exports = db.model('Users', userSchema);