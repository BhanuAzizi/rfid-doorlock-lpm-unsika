const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DeviceStatus = sequelize.define(
  "device_status",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    device_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },

    mode: {
      type: DataTypes.ENUM("akses", "daftar"),
      defaultValue: "akses"
    }
  },
  {
    timestamps: true,
    createdAt: false,
    updatedAt: "updated_at",
    tableName: "device_status"
  }
);

module.exports = DeviceStatus;
