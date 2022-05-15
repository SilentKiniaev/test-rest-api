const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { param } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validator.middleware');
const { upload, list, deleteFile, getFile, downloadFile, updateFile } = require('../controllers/file.controller');
const { checkAuth } = require('../middlewares/auth.middlewares');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

router.post('/file/upload', checkAuth, multer({storage: storageConfig}).single('file'), upload);

router.get('/file/list', checkAuth, list);

router.delete('/file/delete/:id', checkAuth, param('id').notEmpty(), handleValidationErrors, deleteFile);

router.get('/file/:id', checkAuth, param('id').notEmpty(), handleValidationErrors, getFile);

router.get('/file/download/:id', checkAuth, param('id').notEmpty(), handleValidationErrors, downloadFile);

router.put('/file/update/:id', 
    checkAuth, 
    param('id').notEmpty(), 
    handleValidationErrors, 
    multer({storage: storageConfig}).single('file'), 
    updateFile
);

module.exports = router;