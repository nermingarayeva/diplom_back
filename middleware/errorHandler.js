const { errorResponse } = require('../utils/responseHandler');

const errorHandler = (error, req, res, next) => {
  console.error('Global error:', error);

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return errorResponse(res, 'Məlumat doğrulama xətası', 400, errors);
  }

  if (error.name === 'CastError') {
    return errorResponse(res, 'Keçərli ID deyil', 400);
  }

  if (error.code === 11000) {
    return errorResponse(res, 'Dublikat məlumat', 400);
  }

  errorResponse(res, 'Server xətası baş verdi', 500);
};

const notFound = (req, res) => {
  errorResponse(res, 'API endpoint tapılmadı', 404);
};

module.exports = { errorHandler, notFound };