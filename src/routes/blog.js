const express = require("express");
const router = express.Router();
const { getAllBlogs, getSingleBlog, createBlog, editBlog, updateBlog, deleteBlog, apiAllBlogs, apiSingleBlog } = require("../controllers/blogController"); 

// Admin routes
router.get("/blogs", getAllBlogs); 
router.get("/blogs/new", (req, res) => res.render("blogs/new")); 
router.post("/blogs", createBlog); 
router.get("/blogs/edit/:id", editBlog); 
router.post("/blogs/update/:id", updateBlog); 
router.post("/blogs/delete/:id", deleteBlog); 
router.get("/blogs/:id", getSingleBlog); 

//public 
router.get('/api/blogs',apiAllBlogs);
router.get('/api/blogs/:id',apiSingleBlog);

module.exports = router;