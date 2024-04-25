const util = require('util'),
    multer = require('multer'),
    path = require('path'),
    maxSize = 2 * 1024 * 1024

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'))
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        )
    },
})

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single('image')

let uploadFileMiddleware = util.promisify(uploadFile)
module.exports = uploadFileMiddleware
