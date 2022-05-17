const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Phone number",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "E-mail address",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Hashed password",
    },
    role: {
      type: DataTypes.ENUM,
      values: ["user", "admin"],
      defaultValue: "user",
      comment: "User's Role",
    },
  });

  return User;
};
