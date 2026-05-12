const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Account = sequelize.define("Account", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM("admin", "viewer"),
    defaultValue: "viewer"
  }
});

module.exports = Account;
