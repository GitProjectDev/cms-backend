const Video = require('../models/video')
const { apiGetAllArticles } = require('./articleController')

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 })
    res.render('videos/index', { videos })
  } catch (error) {
    req.flash('error', 'Error fetching videos')
    res.redirect('/dashboard')
  }
}

const getNewVideoForm = (req, res) => {
  res.render('videos/form', {
    video: {},
    action: '/videos/new',
    buttonText: 'Create',
  })
}

const createVideo = async (req, res) => {
  try {
    await Video.create(req.body)
    req.flash('success', 'Video created successfully')
    res.redirect('/videos')
  } catch (error) {
    req.flash('error', 'Error creating video')
    res.redirect('/videos/new')
  }
}

const getSingleVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) {
      req.flash('error', 'Video not found')
      return res.redirect('/dashboard')
    }
    res.render('videos/view', { video })
  } catch (error) {
    req.flash('error', 'Error fetching video')
    res.redirect('/dashboard')
  }
}

const getEditVideoForm = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) {
      req.flash('error', 'Video not found')
      return res.redirect('/videos')
    }
    res.render('videos/form', {
      video,
      action: `/videos/edit/${video._id}`,
      buttonText: 'Update',
    })
  } catch (error) {
    req.flash('error', 'Error fetching video')
    res.redirect('/videos')
  }
}

const updateVideo = async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, req.body)
    req.flash('success', 'Video updated successfully')
    res.redirect('/videos')
  } catch (error) {
    req.flash('error', 'Error updating video')
    res.redirect(`/videos/edit/${req.params.id}`)
  }
}

const deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id)
    req.flash('success', 'Video deleted successfully')
    res.redirect('/videos')
  } catch (error) {
    req.flash('error', 'Error deleting video')
    res.redirect('/videos')
  }
}

// Public API - Get All Videos
const apiGetAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .select('title url description createdAt')
    res.json({ success: true, videos })
  } catch (error) {
    console.error('API Get All Videos Error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch videos' })
  }
}

// Public API - Get Single Video by ID
const apiGetVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).select(
      'title url description createdAt'
    )
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: 'Video not found' })
    }
    res.json({ success: true, video })
  } catch (error) {
    console.error('API Get Video By ID Error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch video' })
  }
}

module.exports = {
  getAllVideos,
  getNewVideoForm,
  createVideo,
  getEditVideoForm,
  updateVideo,
  deleteVideo,
  getSingleVideo,
  apiGetAllVideos,
  apiGetVideoById,
}
