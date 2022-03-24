const multer = require('multer');

const uploadFileMulter = (path, fileNamePrefix, fieldName) => {
    const storage = multer.diskStorage({
        destination: path,
        filename: function (req, file, callback) {
            const fileName = `${fileNamePrefix}${new Date().getTime()}${file.originalname.slice(file.originalname.lastIndexOf('.'))}`;
            callback(undefined, fileName);
        }
    });

    const upload = multer({
        storage: storage,
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(png|jpg|jpeg)/i)) {
                callback(new Error("Only PNG,JPG and JPEG is allowed."));
            }else{
                callback(null, true);
            }
        }

    });
    return upload.single(fieldName);
}

module.exports = uploadFileMulter;