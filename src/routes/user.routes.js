const router = require('express').Router();
const { checkAuth } = require('../middlewares/auth.middlewares');
const { info } = require('../controllers/user.controller');

router.get('/info', checkAuth, info);

module.exports = router;