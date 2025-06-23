const Budget = require("../models/Budget");

exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (err) {
    next(err);
  }
};

exports.createBudget = async (req, res, next) => {
  try {
    const budget = await Budget.create({ ...req.body, user: req.user._id });
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Büdcə tapılmadı" });
    }

    res.json(budget);
  } catch (err) {
    next(err);
  }
};