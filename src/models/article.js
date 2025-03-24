const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content:{type: String} ,
    author: {type: String},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
