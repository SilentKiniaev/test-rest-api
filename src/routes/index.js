const router = require("express").Router();
const auth = require("./auth.routes");
const file = require("./file.routes");
const user = require("./user.routes");

router.use("/auth", auth);
router.use("/file", file);
router.use("/user", user);

module.exports = router;
