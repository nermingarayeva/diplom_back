const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token təqdim edilməyib" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    console.log("Decoded Token:", decoded); 

    const user = await User.findById(decoded.id); 

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "İcazə verilmir" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token yoxlanış xətası:", err.message);
    return res.status(401).json({ message: "Token etibarsızdır" });
  }
};

module.exports = auth;
