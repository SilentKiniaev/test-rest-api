const { Sequelize } = require("sequelize");
const config = require("../../config");
const sequelize = new Sequelize(config.database);
const User = require("./user")(sequelize);
const File = require("./file")(sequelize);
const Token = require("./token")(sequelize);

User.hasMany(File);
File.belongsTo(User);

module.exports = {
  sequelize,
  User,
  File,
  Token,
};
