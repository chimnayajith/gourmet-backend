const mongoose = require("mongoose");
require("dotenv").config();

const {MONGODB_URI} = process.env;

const db = mongoose.createConnection(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

db.on('error', (error) => {
  console.error('Connection error for Data:', error);
});

db.once('open', () => {
  console.log('Connected to the database');
});

module.exports = db;