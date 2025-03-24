const Blog = require("../models/blog");
const sanitizeHtml = require("sanitize-html");
const path = require("path");

// Display all blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "name").sort({ createdAt: -1 }).lean();
        res.render("blogs/index", { title: "All Blogs", blogs, success: req.flash("success"), error: req.flash("error") });
    } catch (error) {
        console.error("Error retrieving blogs:", error);
        req.flash("error", "Error retrieving blogs");
        res.render("blogs/index", { title: "All Blogs", blogs: [], success: [], error: [] });
    }
};

// Display a single blog post
const getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("author", "name").lean();
        if (!blog) {
            req.flash("error", "Blog not found");
            return res.redirect("/blogs");
        }
        res.render("blogs/view", { title: blog.title, blog, success: req.flash("success"), error: req.flash("error") });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error retrieving blog");
        res.redirect("/blogs");
    }
};

// Show the form to create a new blog
const newBlogForm = (req, res) => {
    res.render("blogs/form", { title: "Create New Blog", success: req.flash("success"), error: req.flash("error") });
};

// Create a new blog
const createBlog = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging
        console.log("Uploaded File:", req.file); // Debugging

        const { title, description, author } = req.body;
        if (!author) {
            req.flash("error", "Author is required!");
            return res.redirect("/blogs/new");
        }

        const image = req.file ?`/src/uploads/${req.file.filename}` : '';
        const sanitizedDescription = sanitizeHtml(description, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                "img", "p", "h1", "h2", "h3", "strong", "em", "ul", "ol", "li", "a"
            ]),
            allowedAttributes: { img: ["src", "alt"], a: ["href", "target"] }
        });

        const newBlog = new Blog({ title, description: sanitizedDescription, image, author });
        await newBlog.save();

        req.flash("success", "Blog created successfully!");
        res.redirect("/blogs");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error creating blog");
        res.redirect("/blogs/new");
    }
};


// Show the form to edit a blog
const editBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).lean();
        if (!blog) {
            req.flash("error", "Blog not found");
            return res.redirect("/blogs");
        }
        res.render("blogs/edit", { title: "Edit Blog", blog, success: req.flash("success"), error: req.flash("error") });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error retrieving blog for edit");
        res.redirect("/blogs");
    }
};

// Update an existing blog
const updateBlog = async (req, res) => {
    try {
        const { title, description, author } = req.body;
        const image = req.file ? req.file.filename : req.body.existingImage;

        const sanitizedDescription = sanitizeHtml(description, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "p", "h1", "h2", "h3", "strong", "em", "ul", "ol", "li", "a"]),
            allowedAttributes: { img: ["src", "alt"], a: ["href", "target"] }
        });

        await Blog.findByIdAndUpdate(req.params.id, { title, description: sanitizedDescription, image, author });

        req.flash("success", "Blog updated successfully!");
        res.redirect("/blogs");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error updating blog");
        res.redirect("/blogs");
    }
};

// Delete a blog
const deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        req.flash("success", "Blog deleted successfully!");
        res.redirect("/blogs");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error deleting blog");
        res.redirect("/blogs");
    }
};

module.exports = { getAllBlogs, getSingleBlog, newBlogForm, createBlog, editBlog, updateBlog, deleteBlog };