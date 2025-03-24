const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getAllBlogs,
  getSingleBlog,
  newBlogForm,
  createBlog,
  editBlog,
  updateBlog,
  deleteBlog
} = require("../controllers/blogController");

// Blog routes
router.get("/", getAllBlogs);
router.get("/new", newBlogForm);
router.post("/", upload.single("image"), createBlog);
router.get("/edit/:id", editBlog);
router.post("/update/:id", upload.single("image"), updateBlog);
router.post("/delete/:id", deleteBlog);
router.get("/:id", getSingleBlog);

module.exports = router;