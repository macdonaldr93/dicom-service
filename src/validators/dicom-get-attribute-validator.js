const {ValidationError} = require('../models/validation-error');

/**
 * Validator for get attributes from DICOM record
 */
class DICOMGetAttributeValidator {
  constructor() {
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
    if (typeof req.query.ge !== 'string') {
      this.errors.push(
        new ValidationError({
          code: 'required',
          field: 'ge',
          message: 'ge (Group/Element) query parameter is required',
        }),
      );
    }

    if (this.errors.length === 0) {
      return next();
    } else {
      return res
        .status(422)
        .json({errors: this.errors.map((err) => err.toJSON())});
    }
  }
}

module.exports = {DICOMGetAttributeValidator};
