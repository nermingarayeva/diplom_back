const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB bağlantısı uğurla quruldu ✅");
  } catch (err) {
    console.error("MongoDB bağlantısında xəta:", err.message);
    process.exit(1); // server dayansın əgər bağlantı uğursuz olarsa
  }
};

module.exports = connectDB;
