const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PendingRegistration = sequelize.define(
  "PendingRegistration",
  {
    uid_rfid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "pending_registrations",
    timestamps: false,
  }
);

module.exports = PendingRegistration;
