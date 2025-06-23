const User = require("../models/User");

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "İstifadəçi tapılmadı"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, preferences } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "İstifadəçi tapılmadı"
      });
    }

    res.json({
      success: true,
      message: "İstifadəçi məlumatları uğurla yeniləndi",
      data: user
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bu email artıq istifadə olunub"
      });
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "İstifadəçi tapılmadı"
      });
    }

    res.json({
      success: true,
      message: "İstifadəçi hesabı uğurla silindi"
    });
  } catch (err) {
    next(err);
  }
};