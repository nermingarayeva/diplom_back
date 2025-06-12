const Transaction = require("../models/Transaction");

exports.getUserTransactions = async (userId) => {
  return await Transaction.find({ user: userId });
};

exports.createTransaction = async (data) => {
  return await Transaction.create(data);
};

exports.deleteTransaction = async (transactionId) => {
  return await Transaction.findByIdAndDelete(transactionId);
};