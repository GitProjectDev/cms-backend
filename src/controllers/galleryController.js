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

const getNewGalleryForm = (req, res) => {
  res.render('galleries/form', { gallery: {}, action: '/galleries/new', buttonText: 'Create' });
};

const createGallery = async (req, res) => {
  try {
    await Gallery.create(req.body);
    req.flash('success', 'Gallery image added successfully');
    res.redirect('/galleries');
  } catch (error) {
    req.flash('error', 'Error adding gallery image');
    res.redirect('/galleries/new');
  }
};

const getEditGalleryForm = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    res.render('galleries/form', { gallery, action: `/galleries/edit/${gallery._id}`, buttonText: 'Update' });
  } catch (error) {
    req.flash('error', 'Error fetching gallery image');
    res.redirect('/galleries');
  }
};

const updateGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndUpdate(req.params.id, req.body);
    req.flash('success', 'Gallery image updated successfully');
    res.redirect('/galleries');
  } catch (error) {
    req.flash('error', 'Error updating gallery image');
    res.redirect(`/galleries/edit/${req.params.id}`);
  }
};

const deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    req.flash('success', 'Gallery image deleted successfully');
    res.redirect('/galleries');
  } catch (error) {
    req.flash('error', 'Error deleting gallery image');
    res.redirect('/galleries');
  }
};

module.exports = { getAllGalleries, getNewGalleryForm, createGallery, getEditGalleryForm, updateGallery, deleteGallery };
