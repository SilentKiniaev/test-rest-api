const { Sequelize } = require('sequelize');
const config = require('../..config');
const sequelize = new Sequelize(config.database);
const User = require('./src/models/user')(sequelize);
const File = require('./src/models/file')(sequelize);
const Token = require('./src/models/token')(sequelize);

User.hasMany(File);
File.belongsTo(User);

module.exports = {
    sequelize,
    User,
    File,
    Token
};