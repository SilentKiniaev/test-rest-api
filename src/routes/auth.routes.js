const router = require('express').Router();
const { body, buildCheckFunction } = require('express-validator');
const { isEmail, isMobilePhone } = require('validator');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);
const { signin, signup, token, logout } = require('../controllers/auth.controller');
const { checkAuth } = require('../middlewares/auth.middlewares');
const { handleValidationErrors } = require('../middlewares/validator.middleware');

router.post('/signin',
    body('id').custom((value) => isEmail(value) || isMobilePhone(value)),
    body('password').notEmpty(),
    handleValidationErrors,
    signin
);

router.post('/signin/new_token', 
    checkBodyAndQuery('refreshToken').isJWT(),
    handleValidationErrors,
    token
);

router.post('/signup',
    body('email').isEmail().normalizeEmail(),
    body('phone').isMobilePhone(),
    body('password').isStrongPassword().bail().custom((value, { req }) => value === req.body.passwordConfirm),
    handleValidationErrors,
    signup
);

router.get('/logout', checkAuth, logout);

module.exports = router;