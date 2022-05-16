const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const config = require('../../config');
const { User, Token } = require('../models');

async function signin({ body }, res) {
    try {
        console.log('signin', body);

        const user = await User.findOne({
            where: {    
                [Op.or]: {
                    email: body.id,
                    phone: body.id
                }
            }
        }).then(async data => {
            if (!data) {
                return null;
            }

            let matched = await bcrypt.compare(body.password, data.password);
            if (!matched) {
                return null;
            }

            return data.toJSON();
        });

        if (!user) {
            return res.status(400).send({message: 'Invalid data'});
        }

        const {password, ...payload} = user;

        const accessToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.accessExpiresIn});
        const refreshToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.refreshExpiresIn});

        res.send({
            accessToken,
            refreshToken
        });

    } catch (e) {
        res.status(e?.status ?? 500).send({ message: e.message });
    }
};

async function token({ body, query }, res) {
    try {
        const token = body?.refreshToken ?? query.refreshToken;

        const decoded = jwt.verify(token, config.jwt.secret, (err, decoded) => {
            if (err) {
                err.status = 403;
                throw err;
            }

            return decoded;
        });

        const user = await User.findByPk(decoded.id).then(data => data.toJSON());
        const {password, ...payload} = user;

        await Token.create({token, type: 'refresh'});

        const accessToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.accessExpiresIn});
        const refreshToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.refreshExpiresIn});

        res.send({
            accessToken,
            refreshToken
        });
    } catch (e) {
        res.status(e?.status ?? 500).send({ message: e.message });
    }
};

async function signup({ body }, res) {
    try {
        console.log('signup', body);

        const hashedPassword = await bcrypt.hash(body.password, 8);
        const {password, ...payload} = await User.create({...body, password: hashedPassword}).then(data => data.toJSON());

        const accessToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.accessExpiresIn});
        const refreshToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.refreshExpiresIn});

        res.send({
            accessToken,
            refreshToken
        });
    } catch (e) {
        res.status(e?.status ?? 500).send({ message: e.message });
    }
};

async function logout(req, res) {
    try {
        const {password, ...payload} = req.state.user.toJSON();

        await Token.create({token: req.state.accessToken});

        const accessToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.accessExpiresIn});
        const refreshToken = jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.refreshExpiresIn});

        res.send({
            accessToken,
            refreshToken
        });
    } catch (e) {
        res.status(e?.status ?? 500).send({ message: e.message });
    }    
}

module.exports = {
    signin,
    signup,
    token,
    logout
}