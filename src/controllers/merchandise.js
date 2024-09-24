const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const CreateMerchandise = require('../services/merchandise/createMerchandise');
const GetMerchandise = require('../services/merchandise/getMerchandise');
const UpdateMerchandise = require('../services/merchandise/updateMerchandise');
const DeleteMerchandise = require('../services/merchandise/deleteMerchandise');


const GetMerchandiseById = async (req, res) => {
  try {
    const { id } = req.params; // Mendapatkan id dari parameter URL
    const merchandise = await GetMerchandise(id); // Mengambil detail merchandise berdasarkan ID

    // Jika merchandise tidak ditemukan, kembalikan respon 404
    if (!merchandise) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Merchandise tidak ditemukan',
      }));
    }

    // Kembalikan data merchandise jika ditemukan
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Merchandise ditemukan',
      data: merchandise,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil merchandise',
    }));
  }
};

// Get all merchandise
const GetAllMerchandise = async (req, res) => {
  try {
    const { search } = req.query;
    const merchandise = await GetMerchandise(null, search);
    res.status(StatusCodes.OK).json(new DataTable(merchandise.data, merchandise.total));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

// Create new merchandise
const CreateNewMerchandise = async (req, res) => {
  try {
    const {body, files} = req; // Data yang dikirim dari client (request body)
    const baseUrl = `${req.protocol}://${req.get('host')}`; 
    const newMerchandise = await CreateMerchandise(body, files, baseUrl);

    res.status(StatusCodes.CREATED).json(new BaseResponse({
      status: StatusCodes.CREATED,
      message: 'Merchandise created successfully',
      data: newMerchandise,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Failed to create merchandise',
    }));
  }
};

// Update merchandise by ID
const UpdateMerchandiseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, files } = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`; 
    const updatedMerchandise = await UpdateMerchandise(id, body, files, baseUrl);

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Merchandise berhasil diperbarui',
      data: updatedMerchandise,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

// Delete merchandise by ID
const DeleteMerchandiseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DeleteMerchandise(id);
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: result.message,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

module.exports = {
  GetMerchandiseById,
  GetAllMerchandise,
  CreateNewMerchandise,
  UpdateMerchandiseById,
  DeleteMerchandiseById,
};
