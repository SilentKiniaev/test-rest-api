const router = require('express').Router();
const { body, buildCheckFunction } = require('express-validator');
const { isEmail, isMobilePhone } = require('validator');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);
const { signin, signup, token, logout } = require('../controllers/auth.controller');
const { checkAuth } = require('../middlewares/auth.middlewares');
const { handleValidationErrors } = require('../middlewares/validator.middleware');
const { Op } = require('sequelize');
const { User } = require('../models');

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
    async (req, res, next) => {
        const user = await User.findOne({
            where: {
                [Op.or]: {
                    email: req.body.email,
                    phone: req.body.phone
                }
            }
        });

        if (user) {
            return res.status(400).send({message: 'Try another data'});
        }

        next();
    },
    signup
);

router.get('/logout', checkAuth, logout);

module.exports = router;