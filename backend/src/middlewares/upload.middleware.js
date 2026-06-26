const multer = require("multer");
const path = require("path");
const fs = require("fs");

const AppError = require("../utils/AppError");

const createUploader = (folderName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `uploads/${folderName}`;

      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);

      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new AppError("Only JPG, JPEG, PNG and WEBP images are allowed", 400),
        false
      );
    }

    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  });
};

module.exports = {
  createUploader,
};