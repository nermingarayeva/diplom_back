require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  db: {
    uri: process.env.MONGO_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "30d",
  },
};
