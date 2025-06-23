const Goal = require("../models/Goal");

exports.getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });
    
    res.json({
      success: true,
      data: goals
    });
  } catch (err) {
    console.error('Get goals error:', err);
    res.status(500).json({
      success: false,
      message: 'Məqsədlər yüklənərkən xəta baş verdi',
      error: err.message
    });
  }
};

exports.createGoal = async (req, res, next) => {
  try {
    console.log('Creating goal with data:', req.body);
    console.log('User ID:', req.user._id);
    
    const goalData = {
      ...req.body,
      userId: req.user._id 
    };
    
    const goal = await Goal.create(goalData);
    
    console.log('Goal created successfully:', goal);
    
    res.status(201).json({
      success: true,
      data: goal,
      message: 'Məqsəd uğurla yaradıldı'
    });
  } catch (err) {
    console.error('Create goal error:', err);
    res.status(400).json({
      success: false,
      message: 'Məqsəd yaradılarkən xəta baş verdi',
      error: err.message
    });
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.user._id 
      },
      req.body,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: "Goal tapılmadı" 
      });
    }

    res.json({
      success: true,
      data: goal,
      message: 'Məqsəd uğurla yeniləndi'
    });
  } catch (err) {
    console.error('Update goal error:', err);
    res.status(400).json({
      success: false,
      message: 'Məqsəd yenilənərkən xəta baş verdi',
      error: err.message
    });
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id 
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal tapılmadı"
      });
    }

    res.json({
      success: true,
      message: "Goal uğurla silindi"
    });
  } catch (err) {
    console.error('Delete goal error:', err);
    res.status(500).json({
      success: false,
      message: 'Goal silinərkən xəta baş verdi',
      error: err.message
    });
  }
};
