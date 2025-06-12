require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    uri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "7d",
  },
};
