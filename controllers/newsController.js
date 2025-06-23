const News = require('../models/News');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Get all news
exports.getAllNews = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      category, 
      sort = 'date' 
    } = req.query;

    const query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const sortOptions = {};
    if (sort === 'date') {
      sortOptions.date = -1;
    } else if (sort === 'title') {
      sortOptions.title = 1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const news = await News
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalCount = await News.countDocuments(query);

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      totalItems: totalCount,
      itemsPerPage: parseInt(limit)
    };

    successResponse(res, news, 'Xəbərlər uğurla əldə edildi', pagination);
  } catch (error) {
    next(error);
  }
};

// Create news
exports.createNews = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Məlumat xətası', 400, errors.array());
    }

    const { title, content, category, author } = req.body;

    const newNews = new News({
      title,
      content,
      category,
      author: author || 'Admin'
    });

    const savedNews = await newNews.save();

    successResponse(res, savedNews, 'Xəbər uğurla əlavə edildi', null, 201);
  } catch (error) {
    next(error);
  }
};

// Get single news
exports.getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findOne({ 
      _id: id, 
      isActive: true 
    }).lean();

    if (!news) {
      return errorResponse(res, 'Xəbər tapılmadı', 404);
    }

    successResponse(res, news, 'Xəbər uğurla əldə edildi');
  } catch (error) {
    next(error);
  }
};

// Update news
exports.updateNews = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Məlumat xətası', 400, errors.array());
    }

    const { id } = req.params;

    const updatedNews = await News.findOneAndUpdate(
      { _id: id, isActive: true },
      { 
        ...req.body,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedNews) {
      return errorResponse(res, 'Xəbər tapılmadı', 404);
    }

    successResponse(res, updatedNews, 'Xəbər uğurla yeniləndi');
  } catch (error) {
    next(error);
  }
};

// Delete news (soft delete)
exports.deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedNews = await News.findOneAndUpdate(
      { _id: id, isActive: true },
      { 
        isActive: false,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!deletedNews) {
      return errorResponse(res, 'Xəbər tapılmadı', 404);
    }

    successResponse(res, null, 'Xəbər uğurla silindi');
  } catch (error) {
    next(error);
  }
};

// Get news by category
exports.getNewsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const validCategories = ['Layihə', 'Texnologiya', 'Dizayn', 'Şəxsi'];
    
    if (!validCategories.includes(category)) {
      return errorResponse(res, 'Keçərli kateqoriya deyil', 400);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const news = await News
      .find({ 
        category: category, 
        isActive: true 
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalCount = await News.countDocuments({ 
      category: category, 
      isActive: true 
    });

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      totalItems: totalCount,
      itemsPerPage: parseInt(limit)
    };

    successResponse(res, news, 'Kateqoriya xəbərləri əldə edildi', pagination);
  } catch (error) {
    next(error);
  }
};