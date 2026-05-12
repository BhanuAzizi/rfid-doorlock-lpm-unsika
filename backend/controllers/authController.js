const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await Account.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ message: "User tidak ditemukan" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Password salah" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      username: user.username,
      role: user.role
    }
  });
};
