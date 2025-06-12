const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const transactionController = require("../controllers/transactionController");

router.get("/", auth, transactionController.getTransactions);
router.post("/", auth, transactionController.createTransaction);
router.delete("/:id", auth, transactionController.deleteTransaction);

module.exports = router;
