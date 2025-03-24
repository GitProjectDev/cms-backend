const mongoose = require ('mongoose')

const blogSchema = new mongoose.Schema({
    title: {type:String, required: true},
    description: {type:String, required:true},
    image:{type:String, required:false},
    author:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Blog',blogSchema)