exports.deviceAuth = (req, res, next) => {
  const key = req.headers["x-device-key"];

  console.log("DEVICE KEY:", key);

  if (!key || key !== process.env.DEVICE_KEY) {
    return res.status(401).json({
      message: "Unauthorized device"
    });
  }

  next();
};
