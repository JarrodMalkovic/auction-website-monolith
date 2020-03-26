const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const dotenv = require('dotenv').config({ path: './config.env' });

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      var dbName = 'test';
    } else {
      var dbName = 'Production';
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      dbName
    });

    console.log(`MongoDB Connected to ${dbName} DB...`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
