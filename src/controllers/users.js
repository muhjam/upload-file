const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const CreateUser = require('../services/users/createUsers');
const GetUser = require('../services/users/getUsers');
const UpdateUser = require('../services/users/updateUsers'); // Fixed the function name
const DeleteUser = require('../services/users/deleteUsers'); // Fixed the function name

const GetUserById = async (req, res) => {
  try {
    const { id } = req.params; // Mendapatkan id dari parameter URL
    const user = await GetUser({ id: id }); // Mengambil detail transaction berdasarkan ID

    // Jika transaction tidak ditemukan, kembalikan respon 404
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'User tidak ditemukan',
      }));
    }

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'User ditemukan',
      data: user,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil User',
    }));
  }
};

const GetUserByCode = async (req, res) => {
  try { // Mendapatkan code dari parameter URL
    const user = await GetUser({ code: code }); // Mengambil detail User berdasarkan code

    // Jika User tidak ditemukan, kembalikan respon 404
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'User tidak ditemukan',
      }));
    }

    // Kembalikan data User jika ditemukan
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'User ditemukan',
      data: user,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil User',
    }));
  }
};

const GetAllUser = async (req, res) => {
  try {
    const { search } = req.query;
    const code = req.query.q;

    const user = await GetUser({code:code}, search); // Adjusted function call

    res.status(StatusCodes.OK).json(new DataTable(user.data, user.total));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

// Create new User
const CreateNewUser = async (req, res) => {
  try {
    const { body, files } = req; // Data yang dikirim dari client (request body)
    const baseUrl = `${req.protocol}://${req.get('host')}`; 
    const newUser = await CreateUser(body, files, baseUrl);

    res.status(StatusCodes.CREATED).json(new BaseResponse({
      status: StatusCodes.CREATED,
      message: 'User created successfully',
      data: newUser,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Failed to create User',
    }));
  }
};

// Update transaction by ID
const UpdateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, files } = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`; 
    const updatedUser = await UpdateUser(id, body, files, baseUrl);

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Transaction berhasil diperbarui',
      data: updatedUser,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

// Delete transaction by ID
const DeleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DeleteUser(id);
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
  GetUserById,
  GetUserByCode,
  GetAllUser,
  CreateNewUser,
  UpdateUserById,
  DeleteUserById,
};
