const fs = require('fs').promises;
const path = require('path');
const Gallery = require('../models/Gallery');
const uploadDir = path.join(__dirname, '../uploads');

const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.render('galleries/index', { galleries });
  } catch (error) {
    req.flash('error', 'Error fetching galleries');
    res.redirect('/dashboard');
  }
};

const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      req.flash('error', 'Gallery image not found');
      return res.redirect('/galleries');
    }
    res.render('galleries/view', { gallery });
  } catch (error) {
    req.flash('error', 'Error fetching gallery details');
    res.redirect('/galleries');
  }
};

const getNewGalleryForm = (req, res) => {
  res.render('galleries/form', { 
    gallery: {}, 
    action: '/galleries/new', 
    buttonText: 'Create' 
  });
};

const createGallery = async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error', 'Image is required');
      return res.redirect('/galleries/new');
    }

    await Gallery.create({
      title: req.body.title,
      imageUrl: `/uploads/${req.file.filename}`,
      description: req.body.description || "",
    });
    req.flash('success', 'Gallery image added successfully');
    res.redirect('/galleries/');
  } catch (error) {
    // If there is an error and a file was uploaded, try to delete it
    if (req.file) {
      const filePath = path.join(uploadDir, req.file.filename);
      await fs.unlink(filePath).catch(err => console.error('Error deleting file:', err));
    }
    req.flash('error', 'Error adding gallery image');
    res.redirect('/galleries/new');
  }
};

const getEditGalleryForm = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      req.flash('error', 'Gallery image not found');
      return res.redirect('/galleries/');
    }
    res.render('galleries/form', { 
      gallery, 
      action: `/galleries/edit/${gallery._id}`, 
      buttonText: 'Update' 
    });
  } catch (error) {
    req.flash('error', 'Error fetching gallery image');
    res.redirect('/galleries/');
  }
};

const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      req.flash('error', 'Gallery image not found');
      return res.redirect('/galleries/');
    }

    let newImage = gallery.imageUrl;
    if (req.file) {
      newImage = `/uploads/${req.file.filename}`;
      // Delete the old image if one exists
      if (gallery.imageUrl) {
        const oldImage = path.basename(gallery.imageUrl);
        const oldImagePath = path.join(uploadDir, oldImage);
        await fs.unlink(oldImagePath).catch(err => {
          console.error('Error deleting old gallery image:', err);
        });
      }
    }

    gallery.title = req.body.title;
    gallery.description = req.body.description || '';
    gallery.imageUrl = newImage;
    await gallery.save();

    req.flash('success', 'Gallery image updated successfully');
    res.redirect('/galleries/');
  } catch (error) {
    console.error('Update Error:', error);
    // If a new image was uploaded but an error occurs, remove the uploaded file
    if (req.file) {
      const newImagePath = path.join(uploadDir, req.file.filename);
      await fs.unlink(newImagePath).catch(err => {
        console.error('Error cleaning up new gallery image:', err);
      });
    }
    req.flash('error', 'Error updating gallery image');
    res.redirect(`/galleries/edit/${req.params.id}`);
  }
};

const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) {
      req.flash('error', 'Gallery image not found');
      return res.redirect('/galleries/');
    }

    if (gallery.imageUrl) {
      const filename = path.basename(gallery.imageUrl);
      const imagePath = path.join(uploadDir, filename);
      await fs.unlink(imagePath).catch(err => {
        console.error('Error deleting gallery image:', err);
      });
    }

    req.flash('success', 'Gallery image deleted successfully');
    res.redirect('/galleries/');
  } catch (error) {
    console.error('Delete Error:', error);
    req.flash('error', 'Error deleting gallery image');
    res.redirect('/galleries/');
  }
};

// Public API - Get All Galleries
const apiGetAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 }).select('title imageUrl description createdAt');
    res.json({ success: true, galleries });
  } catch (error) {
    console.error('API Get All Galleries Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch galleries' });
  }
};

// Public API - Get Gallery by ID
const apiGetGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id).select('title imageUrl description createdAt');
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery not found' });
    }
    res.json({ success: true, gallery });
  } catch (error) {
    console.error('API Get Gallery By ID Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery' });
  }
};

module.exports = {
  getAllGalleries,
  getNewGalleryForm,
  createGallery,
  getEditGalleryForm,
  updateGallery,
  deleteGallery,
  getGalleryById,
  apiGetAllGalleries,
  apiGetGalleryById
};
