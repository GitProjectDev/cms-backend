const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/'); // Destination folder for uploads
    },
    filename: (req, file, cb) => {
        const suffix = Date.now();
        cb(null, `${suffix}-${file.originalname}`); // Unique file naming
    },
});

// File filter for security (only allow images)
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

// Multer upload middleware
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5 MB
    },
    fileFilter,
});

module.exports = upload;
