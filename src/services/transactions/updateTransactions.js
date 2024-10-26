const { Transactions, Merchandises, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const UpdateTransactions = async (id, body) => {
  const transaction = await sequelize.transaction();

  try {
    const transactionRecord = await Transactions.findByPk(id, { transaction });

    if (!transactionRecord) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Transaction not found',
      });
    }

    const { status } = body;
    const { qty, merchandiseId } = transactionRecord;

    if (status === undefined) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Status must be provided for update',
      });
    }

    // Check if the current status is "waiting"
    if (transactionRecord.status === 'waiting' && !['waiting', 'canceled', 'denied'].includes(status)) {
      // Find the merchandise associated with this transaction
      const merchandise = await Merchandises.findByPk(merchandiseId);

      if (!merchandise) {
        throw new BaseError({
          status: StatusCodes.NOT_FOUND,
          message: 'Merchandise not found',
        });
      }

      // Ensure there's enough stock
      if (merchandise.stock < qty) {
        throw new BaseError({
          status: StatusCodes.BAD_REQUEST,
          message: 'Not enough stock available',
        });
      }

      // Decrease the stock
      await Merchandises.update(
        {
          stock: merchandise.stock - qty,
        },
        {
          where: { id: merchandiseId },
          transaction,
        }
      );
    }

    // Update only the status of the transaction
    await Transactions.update(
      {
        status: status || transactionRecord.status,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Transaction status updated successfully, stock adjusted if necessary',
    };
  } catch (error) {
    await transaction.rollback();

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update transaction status: ${error.message || error}`,
    });
  }
};

module.exports = UpdateTransactions;
