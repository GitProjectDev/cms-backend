const Article = require('../models/Article');

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.render('articles/index', { articles });
  } catch (error) {
    req.flash('error', 'Error fetching articles');
    res.redirect('/dashboard');
  }
};

const getNewArticleForm = (req, res) => {
  res.render('articles/form', { article: {}, action: '/articles/new', buttonText: 'Create' });
};

const createArticle = async (req, res) => {
  try {
    await Article.create(req.body);
    req.flash('success', 'Article created successfully');
    res.redirect('/articles');
  } catch (error) {
    req.flash('error', 'Error creating article');
    res.redirect('/articles/new');
  }
};

const getSingleArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      req.flash('error', 'Article not found');
      return res.redirect('/dashboard');
    }
    res.render('articles/view', { article });
  } catch (error) {
    req.flash('error', 'Error fetching article');
    res.redirect('/dashboard');
  }
};

const getEditArticleForm = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      req.flash('error', 'Article not found');
      return res.redirect('/articles');
    }
    res.render('articles/form', { article, action: `/articles/edit/${article._id}`, buttonText: 'Update' });
  } catch (error) {
    req.flash('error', 'Error fetching article');
    res.redirect('/articles');
  }
};

const updateArticle = async (req, res) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, req.body);
    req.flash('success', 'Article updated successfully');
    res.redirect('/articles');
  } catch (error) {
    req.flash('error', 'Error updating article');
    res.redirect(`/articles/edit/${req.params.id}`);
  }
};

const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    req.flash('success', 'Article deleted successfully');
    res.redirect('/articles');
  } catch (error) {
    req.flash('error', 'Error deleting article');
    res.redirect('/articles');
  }
};


// Public API - Get All Articles
const apiGetAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).select('title content createdAt');
    res.json({ success: true, articles });
  } catch (error) {
    console.error('API Get All Articles Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch articles' });
  }
};

// Public API - Get Single Article by ID
const apiGetArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).select('title content createdAt');
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, article });
  } catch (error) {
    console.error('API Get Article By ID Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch article' });
  }
};



module.exports = { 
  getAllArticles, 
  getNewArticleForm, 
  createArticle, 
  getEditArticleForm, 
  updateArticle, 
  deleteArticle, 
  getSingleArticle,
  apiGetAllArticles,
  apiGetArticleById
};
