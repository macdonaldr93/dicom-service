const {ValidationError} = require('../models/validation-error');

/**
 * Validator for creating DICOM records
 */
class DICOMRecordCreateValidator {
  /**
   * @param {object} options Validator options
   * @param {string} options.fileFieldName The field name on the Express request body for the file
   */
  constructor(options = {}) {
    this.fileFieldName = options.fileFieldName;
    /**
     * List of validation errors
     * @type {ValidationError[]}
     */
    this.errors = [];
    this.middleware = this.middleware.bind(this);
    this.validate = this.validate.bind(this);
  }

  middleware() {
    return this.validate;
  }

  /**
   *
   * @param {import('express').Request} req The Express request
   * @param {import('express').Response} res The Express response
   * @param {import('express').NextFunction} next The Express next function
   */
  validate(req, res, next) {
    if (!req.file) {
      this.errors.push(
        new ValidationError({
          code: 'required',
          field: this.fileFieldName,
          message: 'A file is required',
        }),
      );
    }

    if (this.errors.length === 0) {
      // eslint-disable-next-line node/callback-return
      next();
    } else {
      res.status(422).json({errors: this.errors.map((err) => err.toJSON())});
    }
  }
}

module.exports = {DICOMRecordCreateValidator};
