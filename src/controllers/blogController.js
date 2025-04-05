const Blog = require('../models/blog');
const fs = require('fs').promises;
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads');

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash('error', 'Please log in to create a blog.');
      return res.redirect('/auth/login');
    }

    const { title, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const author = req.session.user.id;

    await Blog.create({ title, description, image, author });
    req.flash('success', 'Blog created successfully');
    res.redirect('/blogs');
  } catch (error) {
    console.error('Create Error:', error);
    if (req.file) {
      await fs.unlink(path.join(uploadDir, req.file.filename));
    }
    req.flash('error', 'Failed to create blog');
    res.redirect('/blogs/new');
  }
};

// Get All Blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author');
    res.render('blog/index', { blogs });
  } catch (error) {
    console.error('Fetch Error:', error);
    req.flash('error', 'Error fetching blogs');
    res.redirect('/dashboard');
  }
};

// Get Single Blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author');
    if (!blog) {
      req.flash('error', 'Blog not found');
      return res.redirect('/blogs');
    }
    res.render('blog/view', { blog });
  } catch (error) {
    console.error('Single Blog Error:', error);
    req.flash('error', 'Error fetching blog');
    res.redirect('/blogs');
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      req.flash('error', 'Blog not found');
      return res.redirect('/blogs');
    }

    if (req.file) {
      if (blog.image) {
        const oldImage = blog.image.split('/').pop();
        await fs.unlink(path.join(uploadDir, oldImage));
      }
      blog.image = `/uploads/${req.file.filename}`;
    }

    blog.title = title;
    blog.description = description;
    await blog.save();

    req.flash('success', 'Blog updated successfully');
    res.redirect(`/blogs/${req.params.id}`);
  } catch (error) {
    console.error('Update Error:', error);
    if (req.file) {
      await fs.unlink(path.join(uploadDir, req.file.filename));
    }
    req.flash('error', 'Failed to update blog');
    res.redirect(`/blogs/${req.params.id}/edit`);
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      req.flash('error', 'Blog not found');
      return res.redirect('/blogs');
    }

    if (blog.image) {
      const filename = blog.image.split('/').pop();
      await fs.unlink(path.join(uploadDir, filename));
    }

    req.flash('success', 'Blog deleted successfully');
    res.redirect('/blogs');
  } catch (error) {
    console.error('Delete Error:', error);
    req.flash('error', 'Failed to delete blog');
    res.redirect('/blogs');
  }
};

// Form Rendering
exports.getNewBlogForm = (req, res) => {
  res.render('blog/form', { blog: null, editMode: false });
};

exports.getEditBlogForm = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author');
    if (!blog) {
      req.flash('error', 'Blog not found');
      return res.redirect('/blogs');
    }
    res.render('blog/form', { blog, editMode: true });
  } catch (error) {
    console.error('Edit Form Error:', error);
    req.flash('error', 'Error fetching blog');
    res.redirect('/blogs');
  }
};