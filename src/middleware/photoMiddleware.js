const multer = require ('multer');



// config the multer storage 
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'uploads/'); // destination 
    },
    // file name rule for uniqueness 
    filename: (req,file,cb) => {
        const suffix = Date.now();
        cb(null,`${suffix}-${file.originalname}`)  // date and file original name
    },
});


// file type validation 

const fileType = (req,file,cb) => {
    const allowedFileType = /Jpeg|jpg|png/; // allowed types 
    const mineType = allowedFileType.test(file.mineType);
    const extName = allowedFileType.test(path.extName(file.originalname).toLowerCase());

    if(mineType && extName) {
        cb(null, true);
    }else {
        cb(new ERROR('Only .jpeg, .jpg or ,png files are allowed!'),false);
    }
};



    // upload middleware

    const upload = multer({
        storage, 
        limit: {
            fileSize: 5 * 1024 * 1024, // limit the file size to 5mb
        },
        fileType,
    });

    module.exports = upload;
