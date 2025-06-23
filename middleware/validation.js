const mongoose = require('mongoose');
const { errorResponse } = require('../utils/responseHandler');

exports.validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 'Keçərli ID deyil', 400);
  }

  next();
};