const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const accountController = require("../controllers/accountController");

router.get("/", auth, accountController.getAccounts);
router.post("/", auth, accountController.createAccount);
router.put("/:id", auth, accountController.updateAccount);
router.delete("/:id", auth, accountController.deleteAccount);

module.exports = router;