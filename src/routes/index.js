const router = require('express').Router();
const auth = require('./auth.routes');
const file = require('./file.routes');
const user = require('./user.routes');

router.use('/', auth, file, user);

module.exports = router;