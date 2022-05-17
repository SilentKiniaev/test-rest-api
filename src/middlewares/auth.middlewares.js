const jwt = require("jsonwebtoken");
const config = require("../../config");
const { User, Token } = require("../models");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.replace("Bearer ", "");

    const decoded = jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        err.status = 401;
        err.message = "Unauthorized";
        throw err;
      }

      return decoded;
    });

    const blocked = await Token.findOne({
      where: {
        token,
      },
    });

    if (blocked) {
      return res.status(401).send("Unauthorized");
    }

    const user = await User.findByPk(decoded.id);
    req.state = {
      accessToken: token,
      user,
    };

    next();
  } catch (e) {
    res.status(e?.status ?? 500).send({ message: e.message });
  }
};

module.exports = {
  checkAuth,
};
