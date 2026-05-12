const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AccessLog = sequelize.define(
  "access_logs",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uid_rfid: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("granted", "denied"),
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    waktu: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    photo_status: {
      type: DataTypes.ENUM("pending", "uploaded", "failed"),
      allowNull: true,
      defaultValue: "pending",
    },
  },
  {
    timestamps: false,
    tableName: "access_logs",
  },
);

module.exports = AccessLog;