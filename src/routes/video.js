const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getAllVideos,
  getNewVideoForm,
  createVideo,
  getEditVideoForm,
  updateVideo,
  deleteVideo,
  getSingleVideo
} = require('../controllers/videoController');

router.get('/', authMiddleware, getAllVideos);
router.get('/new', authMiddleware, getNewVideoForm);
router.post('/new', authMiddleware, createVideo);
router.get('/:id', authMiddleware, getSingleVideo);
router.get('/edit/:id', authMiddleware, getEditVideoForm);
router.post('/edit/:id', authMiddleware, updateVideo);
router.post('/delete/:id', authMiddleware, deleteVideo);

module.exports = router;