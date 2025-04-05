const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    req.flash('error', err.message);
    return req.params.id 
      ? res.redirect(`/blogs/${req.params.id}/edit`)
      : res.redirect('/blogs/new');
  }
  next();
};

router.get('/', authMiddleware, blogController.getBlogs);
router.get('/new', authMiddleware, blogController.getNewBlogForm);
router.post('/', authMiddleware, upload.single('image'), handleUploadErrors, blogController.createBlog);
router.get('/:id', authMiddleware, blogController.getBlogById);
router.get('/:id/edit', authMiddleware, blogController.getEditBlogForm);
router.put('/:id', authMiddleware, upload.single('image'), handleUploadErrors, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;