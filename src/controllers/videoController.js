const Video = require('../models/video')
const { apiGetAllArticles } = require('./articleController')

// Helper to generate an embeddable URL from a video link
function getEmbedUrl(url) {
  try {
    let embedUrl = url
    // Check for standard YouTube URL
    if (url.includes('youtube.com/watch?v=')) {
      const urlObj = new URL(url)
      const videoId = urlObj.searchParams.get('v')
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      }
    }
    // Check for shortened YouTube URL
    else if (url.includes('youtu.be/')) {
      const parts = url.split('/')
      const videoId = parts.pop()
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      }
    }
    return embedUrl
  } catch (err) {
    // If parsing fails, just return the original URL
    return url
  }
}

// Rendered (admin) endpoints

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

// Public API – Get All Videos (with embed URL)
const apiGetAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 })
    const videosWithEmbed = videos.map((video) => ({
      _id: video._id,
      title: video.title,
      url: video.url,
      embedUrl: getEmbedUrl(video.url), // New field for easy embedding
      description: video.description,
      createdAt: video.createdAt,
    }))
    res.json({ success: true, videos: videosWithEmbed })
  } catch (error) {
    console.error('API Get All Videos Error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch videos' })
  }
}

// Public API – Get Single Video by ID (with embed URL)
const apiGetVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: 'Video not found' })
    }
    res.json({
      success: true,
      video: {
        _id: video._id,
        title: video.title,
        url: video.url,
        embedUrl: getEmbedUrl(video.url), // Included in the response
        description: video.description,
        createdAt: video.createdAt,
      },
    })
  } catch (error) {
    console.error('API Get Video By ID Error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch video' })
  }
}

// New Public API – Get Embed Video (returns just the embed URL)
const apiEmbedVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: 'Video not found' })
    }
    const embedUrl = getEmbedUrl(video.url)
    res.json({ success: true, embedUrl })
  } catch (error) {
    console.error('API Embed Video Error:', error)
    res
      .status(500)
      .json({ success: false, message: 'Failed to generate embed video URL' })
  }
}

module.exports = {
  // Admin routes
  getAllVideos,
  getNewVideoForm,
  createVideo,
  getEditVideoForm,
  updateVideo,
  deleteVideo,
  getSingleVideo,
  // Public API
  apiGetAllVideos,
  apiGetVideoById,
  apiEmbedVideo,
}
