const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const AccessLog = require("./AccessLog");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    uid_rfid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },

    jabatan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("aktif", "nonaktif"),
      defaultValue: "aktif"
    }
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    tableName: "users"
  }
);

User.hasMany(AccessLog, { foreignKey: "user_id" });
AccessLog.belongsTo(User, { foreignKey: "user_id" });

module.exports = User;
