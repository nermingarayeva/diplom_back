const Account = require("../models/Account");

exports.getAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find({ userId: req.user._id }); 
    res.json(accounts);
  } catch (err) {
    next(err);
  }
};

exports.createAccount = async (req, res, next) => {
  try {
    const account = await Account.create({ ...req.body, userId: req.user._id }); 
    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, 
      req.body,
      { new: true }
    );
    
    if (!account) {
      return res.status(404).json({ message: "Account tapılmadı" });
    }
    
    res.json(account);
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await Account.findOneAndDelete({ _id: req.params.id, userId: req.user._id }); 
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};