const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const goalController = require("../controllers/goalController");

router.get("/", auth, goalController.getGoals);
router.post("/", auth, goalController.createGoal);
router.put("/:id", auth, goalController.updateGoal); 
router.delete("/:id", auth, goalController.deleteGoal);

module.exports = router;
