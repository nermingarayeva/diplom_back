const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET || "supersecretkey", 
    { expiresIn: "30d" }
  );
};

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email artıq istifadə olunub" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Qeydiyyat uğurludur",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Email və ya şifrə yanlışdır" });
    }
    if (response.token) {
        localStorage.setItem('authToken', response.token);
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email və ya şifrə yanlışdır" });
    }

    const token = generateToken(user);

    res.json({
      message: "Giriş uğurludur",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
