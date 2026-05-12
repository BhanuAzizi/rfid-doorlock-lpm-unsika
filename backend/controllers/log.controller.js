const { Op } = require("sequelize");
const AccessLog = require("../models/AccessLog");
const User = require("../models/User");

exports.getAccessLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      startDate,
      endDate
    } = req.query;

    const offset = (page - 1) * limit;

    // filter utama
    let where = {};

    // filter waktu
    if (startDate && endDate) {
      where.waktu = {
        [Op.between]: [
          new Date(startDate + " 00:00:00"),
          new Date(endDate + " 23:59:59")
        ]
      };
    }

    const { rows, count } = await AccessLog.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["waktu", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["nama", "jabatan"],
          where: search
            ? {
                [Op.or]: [
                  { nama: { [Op.like]: `%${search}%` } },
                ]
              }
            : undefined,
          required: !!search
        }
      ]
    });

    res.json({
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
