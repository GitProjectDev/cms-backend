// src/controllers/dashboardController.js
const Article = require('../models/Article');
const Blog = require('../models/blog');
const Gallery = require('../models/Gallery');
const Video = require('../models/video');

const renderDashboard = async (req, res) => {
  try {
    // Fetch counts for each content type
    const [articlesCount, blogsCount, galleriesCount, videosCount] = await Promise.all([
      Article.countDocuments(),
      Blog.countDocuments(),
      Gallery.countDocuments(),
      Video.countDocuments()
    ]);

    // Fetch recent content for dashboard preview
    const [recentArticles, recentBlogs, recentGalleries, recentVideos] = await Promise.all([
      Article.find().sort({ createdAt: -1 }).limit(5),
      Blog.find().sort({ createdAt: -1 }).limit(5),
      Gallery.find().sort({ createdAt: -1 }).limit(6),
      Video.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.render('dashboard', {
      user: req.session.user,
      articlesCount,
      blogsCount,
      galleriesCount,
      videosCount,
      recentArticles,
      recentBlogs,
      recentGalleries,
      recentVideos
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/');
  }
};

module.exports = { renderDashboard };
