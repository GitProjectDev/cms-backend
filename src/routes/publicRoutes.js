const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const articleController = require('../controllers/articleController');
const galleryController = require('../controllers/galleryController');
const {
    apiGetAllVideos,
    apiGetVideoById,
    apiEmbedVideo
  } = require('../controllers/videoController');

// Public API routes for Blogs
router.get('/blogs', blogController.apiGetAllBlogs);
router.get('/blogs/:id', blogController.apiGetBlogById);

// Public API routes for Articles
router.get('/articles', articleController.apiGetAllArticles);
router.get('/articles/:id', articleController.apiGetArticleById);

// Public API routes for Galleries
router.get('/galleries', galleryController.apiGetAllGalleries);
router.get('/galleries/:id', galleryController.apiGetGalleryById);

// Public API routes for Videos
router.get('/videos', apiGetAllVideos);
router.get('/videos/:id', apiGetVideoById);
router.get('/videos/embed/:id', apiEmbedVideo);

module.exports = router;
