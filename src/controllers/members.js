const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const CreateMember = require('../services/members/createMembers');
const GetMember = require('../services/members/getMembers');
const UpdateMember = require('../services/members/updateMembers');
const DeleteMember = require('../services/members/deleteMembers');

const GetMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await GetMember(id);

    if (!member) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Member tidak ditemukan',
      }));
    }

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Member ditemukan',
      data: member,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil Member',
    }));
  }
};

const GetMemberByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const member = await GetMember({ code });

    if (!member) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Member tidak ditemukan',
      }));
    }

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Member ditemukan',
      data: member,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil Member',
    }));
  }
};

const GetAllMembers = async (req, res) => {
  try {
    const { search } = req.query;

    const members = await GetMember(null, search);

    res.status(StatusCodes.OK).json(new DataTable(members.data, members.total));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

const CreateNewMember = async (req, res) => {
  try {
    const { body, files } = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const newMember = await CreateMember(body, files, baseUrl);

    res.status(StatusCodes.CREATED).json(new BaseResponse({
      status: StatusCodes.CREATED,
      message: 'Member created successfully',
      data: newMember,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Failed to create Member',
    }));
  }
};

const UpdateMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, files } = req;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const updatedMember = await UpdateMember(id, body, files, baseUrl);

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Member berhasil diperbarui',
      data: updatedMember,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

const DeleteMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DeleteMember(id);
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
  GetMemberById,
  GetMemberByCode,
  GetAllMembers,
  CreateNewMember,
  UpdateMemberById,
  DeleteMemberById,
};
