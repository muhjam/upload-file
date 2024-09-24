const { Merchandise } = require('../../models');
const { Op } = require('sequelize');

// Tambahkan parameter id untuk pengecekan spesifik merchandise
const GetMerchandise = async (id = null, query = {}, search = '') => {
  // Jika id disediakan, kembalikan merchandise berdasarkan id
  if (id) {
    try {
      const merchandise = await Merchandise.findByPk(id); // Cari berdasarkan primary key (id)
      if (!merchandise) {
        throw new Error(`Merchandise dengan id ${id} tidak ditemukan`);
      }
      return merchandise; // Kembalikan detail merchandise
    } catch (error) {
      throw new Error(`Gagal mengambil data merchandise: ${error.message}`);
    }
  }

  // Logika untuk pencarian semua merchandise
  const page = query.page || 1;  // Ambil nilai halaman dari query params (default 1)
  const limit = query.limit || 10;  // Ambil nilai limit dari query params (default 10)
  const offset = (page - 1) * limit;  // Hitung offset berdasarkan page dan limit
  
  const options = {
    where: {},
    limit,
    offset,
    order: [['createdAt', 'DESC']],  // Urutkan berdasarkan tanggal dibuat secara descending
  };

  // Jika ada pencarian, gunakan filter nama merchandise
  if (search) {
    options.where.name = { [Op.like]: `%${search}%` };
  }

  try {
    const { rows, count } = await Merchandise.findAndCountAll(options);

    return {
      data: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new Error(`Gagal mengambil data merchandise: ${error.message}`);
  }
};

module.exports = GetMerchandise;
