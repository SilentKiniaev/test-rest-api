const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { param } = require("express-validator");
const {
  handleValidationErrors,
} = require("../middlewares/validator.middleware");
const {
  upload,
  list,
  deleteFile,
  getFile,
  downloadFile,
  updateFile,
} = require("../controllers/file.controller");
const { checkAuth } = require("../middlewares/auth.middlewares");

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

router.get("/list", checkAuth, list);

router.post(
  "/",
  checkAuth,
  multer({ storage: storageConfig }).single("file"),
  upload
);

router.delete(
  "/:id",
  checkAuth,
  param("id").notEmpty(),
  handleValidationErrors,
  deleteFile
);

router.get(
  "/:id",
  checkAuth,
  param("id").notEmpty(),
  handleValidationErrors,
  getFile
);

router.put(
  "/:id",
  checkAuth,
  param("id").notEmpty(),
  handleValidationErrors,
  multer({ storage: storageConfig }).single("file"),
  updateFile
);

router.get(
  "/download/:id",
  checkAuth,
  param("id").notEmpty(),
  handleValidationErrors,
  downloadFile
);

module.exports = router;
