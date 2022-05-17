const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Token = sequelize.define(
    "Token",
    {
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("refresh", "access"),
        defaultValue: "access",
      },
    },
    {
      tableName: "black_list_tokens",
    }
  );

  return Token;
};
