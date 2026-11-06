const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection to db established");
  } catch (error) {
    console.log("Connection to db failed");
    process.exit(1);
  }
}

module.exports = connectDB;
