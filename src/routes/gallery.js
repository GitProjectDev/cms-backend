const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload'); 
const {
  getAllGalleries,
  getNewGalleryForm,
  createGallery,
  getEditGalleryForm,
  updateGallery,
  deleteGallery
} = require('../controllers/galleryController');

router.get('/', authMiddleware, getAllGalleries);
router.get('/new', authMiddleware, getNewGalleryForm);
router.post('/new', authMiddleware, upload.single('imageUrl'), createGallery);
router.get('/edit/:id', authMiddleware, getEditGalleryForm);
router.post('/edit/:id', authMiddleware, upload.single('imageUrl'), updateGallery);
router.post('/delete/:id', authMiddleware, deleteGallery);

module.exports = router;
