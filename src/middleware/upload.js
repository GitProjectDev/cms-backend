const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/'); // Destination folder latter be the cloud storage 
    },
    filename: (req, file, cb) => {
        const suffix = Date.now();
        cb(null, `${suffix}-${file.originalname}`); // Unique filename {date-originalFilename}
    }
});

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const mimeType = allowedFileTypes.test(file.mimetype);
    const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .jpg, or .png files are allowed!'), false);
    }
};

// Upload middleware
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB size 
    fileFilter
});

module.exports = upload;