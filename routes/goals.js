const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const goalController = require("../controllers/goalController");

router.get("/", auth, goalController.getGoals);
router.post("/", auth, goalController.createGoal);
router.put("/:id", auth, goalController.updateGoal);
router.delete("/:id", auth, goalController.deleteGoal);

router.get('/test', async (req, res) => {
  try {
    const Goal = require('../models/Goal');
    
    const testGoal = new Goal({
      userId: new mongoose.Types.ObjectId(), 
      title: 'Test Məqsəd',
      targetAmount: 1000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      category: 'Other'
    });
    
    await testGoal.save();
    
    res.json({
      success: true,
      message: ' Goal yaradıldı',
      data: testGoal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;