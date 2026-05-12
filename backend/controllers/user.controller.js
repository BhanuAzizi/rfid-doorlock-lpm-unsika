const User = require("../models/User");
const { Op } = require("sequelize");

/*
  GET ALL USERS
*/
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const search = req.query.search || "";
    

    const offset = (page - 1) * limit;

    const { rows, count } = await User.findAndCountAll({
      where: {
        nama: {
          [Op.like]: `%${search}%`
        }
      },
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPage: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
  UPDATE USER
*/
exports.updateUser = async (req, res) => {
  try {
    const { nama, jabatan, status } = req.body;
    const { id } = req.params;

    if (!["aktif", "nonaktif"].includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    user.nama = nama;
    user.jabatan = jabatan;
    user.status = status;

    await user.save();

    res.json({
      message: "User berhasil diperbarui",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
  DELETE USER
*/
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    await user.destroy();

    res.json({
      message: "User berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
