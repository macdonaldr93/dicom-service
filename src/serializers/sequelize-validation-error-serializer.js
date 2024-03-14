const {ValidationError} = require('../models/validation-error');

/**
 * Serializes Sequelize validations errors
 *
 * @param {SequelizeValidationError} err The Sequelize validation error
 *
 * @returns {ValidationError[]} The serialized errors
 */
function serializeSequelizeValidationError(err) {
  const errors = err.errors;
  const validationErrors = errors.map(
    (sequelizeErr) =>
      new ValidationError({
        code: sequelizeErr.validatorKey,
        field: sequelizeErr.path,
        message: sequelizeErr.message,
      }),
  );

  return validationErrors;
}

module.exports = {serializeSequelizeValidationError};
