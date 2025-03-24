const Blog = require("../models/blog");
const sanitizeHtml = require("sanitize-html");

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, description, author } = req.body;
    const image = req.file ? req.file.filename : null;

    // Sanitize Quill-generated HTML
    const sanitizedDescription = sanitizeHtml(description, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "p", "h1", "h2", "h3", "strong", "em", "ul", "ol", "li", "a"
      ]),
      allowedAttributes: {
        img: ["src", "alt"],
        a: ["href", "target"]
      }
    });

    const newBlog = new Blog({
      title,
      description: sanitizedDescription,
      image,
      author
    });
    await newBlog.save();

    req.flash("success", "Blog created successfully!");
    return res.redirect("blogs/index");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error creating blog");
    return res.redirect("blogs/new");
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .lean();

    if (!blogs || blogs.length === 0) {
      req.flash("info", "No blogs found");
      return res.render("blogs/index", { blogs: [] });
    }

    const sanitizedBlogs = blogs.map(blog => ({
      ...blog,
      title: blog.title || 'Untitled',
      description: blog.description || 'No description',
      author: blog.author || { name: 'Unknown' }
    }));

    res.render("blogs/index", { blogs: sanitizedBlogs });
  } catch (error) {
    console.error("Error in getAllBlogs:", error);
    req.flash("error", "Error retrieving blogs");
    res.render("blogs/index", { blogs: [] });
  }
};

// Get a single blog
const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");

    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("blogs/index");
    }

    res.render("blogs/show", { blog });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error retrieving blog");
    return res.redirect("blogs/index");
  }
};

// Render edit form
const editBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");

    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("blogs/index");
    }

    res.render("/blogs/edit", { blog });
  } catch (error) {
    console.error(error);
    req.flash("error", "Error retrieving blog for editing");
    return res.redirect("blogs/index");
  }
};

// Update a blog
const updateBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : req.body.oldImage;

    // Sanitize Quill-generated HTML
    const sanitizedDescription = sanitizeHtml(description, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "p", "h1", "h2", "h3", "strong", "em", "ul", "ol", "li", "a"
      ]),
      allowedAttributes: {
        img: ["src", "alt"],
        a: ["href", "target"]
      }
    });

    await Blog.findByIdAndUpdate(req.params.id, {
      title,
      description: sanitizedDescription,
      image
    });

    req.flash("success", "Blog updated successfully!");
    return res.redirect("blogs/index");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error updating blog");
    return res.redirect(`blogs/edit/${req.params.id}`);
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    req.flash("success", "Blog deleted successfully!");
    return res.redirect("blogs/index");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error deleting blog");
    return res.redirect("blogs/index");
  }
};

// API: Get all blogs
const apiAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name").sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving blogs" });
  }
};

// API: Get a single blog
const apiSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving blog" });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  editBlog,
  updateBlog,
  deleteBlog,
  apiAllBlogs,
  apiSingleBlog
};