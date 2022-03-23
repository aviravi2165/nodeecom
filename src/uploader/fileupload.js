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
                return new Error("Only PNG, JPEG files allowed");
            }
            callback(undefined, true);
        }

    }).single(fieldName);
    return upload;
}

module.exports = uploadFileMulter;