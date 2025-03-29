const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload'); // Middleware for image upload

// Blog routes
router.get('/',authMiddleware, blogController.getBlogs);
router.get('/new',authMiddleware, blogController.getNewBlogForm);
router.post('/',authMiddleware, upload.single('image'), blogController.createBlog);
router.get('/:id',authMiddleware, blogController.getBlogById);
router.get('/:id/edit',authMiddleware, blogController.getEditBlogForm);
router.put('/:id',authMiddleware, upload.single('image'), blogController.updateBlog);
router.delete('/:id',authMiddleware, blogController.deleteBlog);

module.exports = router;