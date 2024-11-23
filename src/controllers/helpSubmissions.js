const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const CreateHelpSubmission = require('../services/helpSubmissions/createHelpSubmissions');
const GetHelpSubmission = require('../services/helpSubmissions/getHelpSubmissions');
const UpdateHelpSubmission = require('../services/helpSubmissions/updateHelpSubmissions');
const DeleteHelpSubmission = require('../services/helpSubmissions/deleteHelpSubmissions');

const GetHelpSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const helpSubmission = await GetHelpSubmission(id);

    if (!helpSubmission) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Help Submission tidak ditemukan',
      }));
    }

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Help Submission ditemukan',
      data: helpSubmission,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil Help Submission',
    }));
  }
};

const GetHelpSubmissionByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const helpSubmission = await GetHelpSubmission({ code });

    if (!helpSubmission) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Help Submission tidak ditemukan',
      }));
    }

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Help Submission ditemukan',
      data: helpSubmission,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil Help Submission',
    }));
  }
};

const GetAllHelpSubmissions = async (req, res) => {
  try {
    const { search } = req.query;

    const helpSubmissions = await GetHelpSubmission(null, search);

    res.status(StatusCodes.OK).json(new DataTable(helpSubmissions.data, helpSubmissions.total));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

const CreateNewHelpSubmission = async (req, res) => {
  try {
    const { body, files } = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const newHelpSubmission = await CreateHelpSubmission(body, files, baseUrl);

    res.status(StatusCodes.CREATED).json(new BaseResponse({
      status: StatusCodes.CREATED,
      message: 'Help Submission created successfully',
      data: newHelpSubmission,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Failed to create Help Submission',
    }));
  }
};

const UpdateHelpSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, files } = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const updatedHelpSubmission = await UpdateHelpSubmission(id, body, files, baseUrl);

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Help Submission berhasil diperbarui',
      data: updatedHelpSubmission,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

const DeleteHelpSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DeleteHelpSubmission(id);
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
  GetHelpSubmissionById,
  GetHelpSubmissionByCode,
  GetAllHelpSubmissions,
  CreateNewHelpSubmission,
  UpdateHelpSubmissionById,
  DeleteHelpSubmissionById,
};
