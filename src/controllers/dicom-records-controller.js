const path = require('path');

const {ValidationError} = require('../models/validation-error');
const {
  serializeDICOMRecord,
} = require('../serializers/dicom-record-serializer');
const {serializeDICOMTag} = require('../serializers/dicom-tag-serializer');
const {
  serializeSequelizeValidationError,
} = require('../serializers/sequelize-validation-error-serializer');
const {logger} = require('../logger');

const ROOT = path.join(__dirname, '../..');

/**
 * DICOM records controller
 */
class DICOMRecordsController {
  /**
   *
   * @param {object} deps Injected dependencies
   * @param {import('../services/dicom-records-service').DICOMRecordsService} deps.dicomRecordsService The DICOM records service
   * @param {import('../services/dicom-viewer-service').DICOMViewerService} deps.dicomViewerService The DICOM viewer service
   */
  constructor(deps = {}) {
    this.dicomRecordsService = deps.dicomRecordsService;
    this.dicomViewerService = deps.dicomViewerService;
    this.fileUploadFieldName = 'dicomFile';
    this.logger = logger.child({module: 'DICOMRecordsController'});
  }

  /**
   * Allows user to create DICOM records
   *
   * @param {import('express').Request} req The Express request
   * @param {import('express').Response} res The Express response
   * @param {import('express').NextFunction} next The Express next function
   */
  async create(req, res, next) {
    try {
      const record = await this.dicomRecordsService.create(req.file);

      if (!record) {
        res.status(500).json({
          errors: [
            new ValidationError({
              code: 'internal_error',
              message: 'DICOM record failed to create',
            }),
          ],
        });
      }

      return res.status(201).json({data: serializeDICOMRecord(record)});
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        const errors = serializeSequelizeValidationError(err);
        return res.status(422).json({errors});
      }

      return next(err);
    }
  }

  /**
   * Retrieve DICOM attribute value by tag
   *
   * @param {import('express').Request} req The Express request
   * @param {import('express').Response} res The Express response
   * @param {import('express').NextFunction} next The Express next function
   */
  async getTag(req, res, next) {
    try {
      const record = await this.dicomRecordsService.findById(req.params.id);

      if (!record) {
        return res.status(404).json({
          errors: [
            new ValidationError({
              code: 'not_found',
              message: 'DICOM record not found',
            }),
          ],
        });
      }

      const ge = req.query.ge;
      const tag = this.dicomRecordsService.getDICOMTag(record, ge);

      if (!tag) {
        return res.status(404).json({
          errors: [
            new ValidationError({
              code: 'not_found',
              message: 'DICOM tag not found',
            }),
          ],
        });
      }

      return res.status(200).json({data: serializeDICOMTag(tag, record)});
    } catch (err) {
      return next(err);
    }
  }

  /**
   * View DICOM as PNG image
   *
   * @param {import('express').Request} req The Express request
   * @param {import('express').Response} res The Express response
   * @param {import('express').NextFunction} next The Express next function
   */
  async viewAsImage(req, res, next) {
    try {
      const record = await this.dicomRecordsService.findById(req.params.id);

      if (!record) {
        return res.status(404).json({
          errors: [
            new ValidationError({
              code: 'not_found',
              message: 'DICOM record not found',
            }),
          ],
        });
      }

      const png = this.dicomViewerService.viewAsPNG(record.DICOMFile);

      return res.status(200).sendFile(png.path, {root: ROOT});
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = {DICOMRecordsController};
