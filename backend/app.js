require("dotenv").config();

const express = require("express");
const cors = require("cors");


const sequelize = require("./config/database");
const deviceRoutes = require("./routes/device.routes");
const rfidRoutes = require("./routes/rfid.routes");
const accessRoutes = require("./routes/access.routes");
const photoRoutes = require("./routes/photo.routes");
const logRoutes = require("./routes/log.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/account");
const path = require("path");
const startPhotoTimeoutJob = require("./jobs/photoTimeout.job");

// load models
require("./models/User");
require("./models/AccessLog");
require("./models/DeviceStatus");
require("./models/Account");


const app = express();
app.use(
  express.raw({
    type: "image/jpeg",
    limit: "10mb",
  }),
);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/device", deviceRoutes);
app.use("/api/rfid", rfidRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/photo", photoRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Doorlock API is running");
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    await sequelize.sync();
    console.log("Database synchronized");
    startPhotoTimeoutJob();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

startServer();
