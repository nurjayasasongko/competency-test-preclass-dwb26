const multer = require("multer");

module.exports = (imageFile) => {
  //create file Upload
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  // Filter File Format
  const fileFilter = function (req, file, cb) {
    if (file.filename === imageFile) {
      if (!file.originalname.match(/\.(png|PNG)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed!",
        };
        return cb(new Error("Only image files are allowed!"), false);
      }
    }
    cb(null, true);
  };

  const sizeInMb = 10;
  const maxSize = sizeInMb * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(imageFile);

  //Upload Process
  return function (req, res, next) {
    upload(req, res, function (err) {
      // if (req.fileValidationError) {
      //   req.session.message = {
      //     type: 'danger',
      //     message: 'Please select file to upload',
      //   };
      //   return res.redirect(req.originalUrl);
      // }

      if (err) {
        // If file size exceeds
        if (err.code == "LIMIT_FILE_SIZE") {
          req.session.message = {
            type: "danger",
            message: "Error, Max file size 10MB",
          };
          return res.redirect(req.originalUrl);
        }

        req.session.message = {
          type: "danger",
          message: err,
        };
        return res.redirect(req.originalUrl);
      }

      return next();
    });
  };
};
