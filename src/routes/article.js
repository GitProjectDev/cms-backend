const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getAllArticles,
  getNewArticleForm,
  createArticle,
  getEditArticleForm,
  updateArticle,
  deleteArticle,
  getSingleArticle
} = require('../controllers/articleController');

router.get('/', authMiddleware, getAllArticles);
router.get('/new', authMiddleware, getNewArticleForm);
router.post('/new', authMiddleware, createArticle);
router.get('/:id', authMiddleware, getSingleArticle);
router.get('/edit/:id', authMiddleware, getEditArticleForm);
router.post('/edit/:id', authMiddleware, updateArticle);
router.post('/delete/:id', authMiddleware, deleteArticle);

module.exports = router;
