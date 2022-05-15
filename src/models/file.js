const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const File = sequelize.define('File', {
        filename: {
            type: DataTypes.STRING
        },
        mimetype: {
            type: DataTypes.STRING
        },
        path: {
            type: DataTypes.STRING
        },
        size: {
            type: DataTypes.INTEGER
        }
    });

    return File;
};