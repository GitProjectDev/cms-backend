const fs = require('fs').promises;
const path = require('path');
const Gallery = require('../models/Gallery');

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
    if (req.file) {
      await fs.unlink(path.join(__dirname, '../src/uploads', req.file.filename));
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
      // Delete old image
      if (gallery.imageUrl) {
        const oldPath = path.join(__dirname, '../src', gallery.imageUrl);
        await fs.unlink(oldPath).catch(err => console.error('Error deleting old image:', err));
      }
    }

    await Gallery.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      imageUrl: newImage,
      description: req.body.description || ''
    });

    req.flash('success', 'Gallery image updated successfully');
    res.redirect('/galleries/');
  } catch (error) {
    if (req.file) {
      await fs.unlink(path.join(__dirname, '../src/uploads', req.file.filename))
        .catch(err => console.error('Error cleaning up new image:', err));
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
      const imagePath = path.join(__dirname, '../src', gallery.imageUrl);
      await fs.unlink(imagePath);
    }

    req.flash('success', 'Gallery image deleted successfully');
    res.redirect('/galleries/');
  } catch (error) {
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