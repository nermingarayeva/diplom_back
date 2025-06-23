const News = require('../models/News');
const { successResponse } = require('../utils/responseHandler');

exports.getStats = async (req, res, next) => {
  try {
    const totalNews = await News.countDocuments({ isActive: true });
    
    const categoryStats = await News.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentNews = await News
      .find({ isActive: true })
      .sort({ date: -1 })
      .limit(5)
      .select('title date category')
      .lean();

    const stats = {
      totalNews,
      categoryStats,
      recentNews
    };

    successResponse(res, stats, 'Statistika məlumatları əldə edildi');
  } catch (error) {
    next(error);
  }
};