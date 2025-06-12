module.exports.createRecurringTransaction = (transaction, date) => {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + 1);
    return {
      ...transaction,
      date: nextDate,
    };
  };
  
  