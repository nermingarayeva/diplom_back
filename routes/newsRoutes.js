const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { validateNews, validateNewsUpdate } = require('../validators/newsValidator');
const { validateObjectId } = require('../middleware/validation');

// GET /api/news - Get all news
router.get('/', newsController.getAllNews);

// POST /api/news - Create news
router.post('/', validateNews, newsController.createNews);

// GET /api/news/category/:category - Get news by category
router.get('/category/:category', newsController.getNewsByCategory);

// GET /api/news/:id - Get single news
router.get('/:id', validateObjectId, newsController.getNewsById);

// PUT /api/news/:id - Update news
router.put('/:id', validateObjectId, validateNewsUpdate, newsController.updateNews);

// DELETE /api/news/:id - Delete news
router.delete('/:id', validateObjectId, newsController.deleteNews);

module.exports = router;