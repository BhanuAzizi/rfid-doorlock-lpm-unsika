const bcrypt = require("bcryptjs");
const Account = require("../models/Account");

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      attributes: ["id", "username", "role", "createdAt"],
    });

    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data akun" });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const existing = await Account.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ message: "Username sudah digunakan" });
    }

    const hash = await bcrypt.hash(password, 10);

    const account = await Account.create({ username, password: hash, role });

    res.json({ id: account.id, username: account.username, role: account.role });
  } catch (err) {
    res.status(500).json({ message: "Gagal membuat akun" });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    await Account.update({ role }, { where: { id: req.params.id } });

    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengubah role" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const targetId = parseInt(req.params.id);

    // Hanya boleh reset password milik sendiri
    if (req.user.id !== targetId) {
      return res.status(403).json({ message: "Tidak diizinkan mereset password akun lain" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const hash = await bcrypt.hash(password, 10);

    await Account.update({ password: hash }, { where: { id: targetId } });

    res.json({ message: "Password berhasil direset" });
  } catch (err) {
    res.status(500).json({ message: "Gagal mereset password" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);

    // Tidak boleh menghapus akun sendiri
    if (req.user.id === targetId) {
      return res.status(403).json({ message: "Tidak dapat menghapus akun sendiri" });
    }

    await Account.destroy({ where: { id: targetId } });

    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus akun" });
  }
};