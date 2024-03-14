const {ValidationError} = require('../models/validation-error');
const {
  serializeDICOMRecord,
} = require('../serializers/dicom-record-serializer');
const {serializeDICOMTag} = require('../serializers/dicom-tag-serializer');

/**
 * DICOM records controller
 */
class DICOMRecordsController {
  /**
   *
   * @param {object} deps Injected dependencies
   * @param {import('../services/dicom-records-service').DICOMRecordsService} dicomRecordsService The DICOM records service
   */
  constructor(deps = {}) {
    this.dicomRecordsService = deps.dicomRecordsService;
    this.fileUploadFieldName = 'dicomFile';
  }

  /**
   * Allows user to create DICOM records
   *
   * @param {import('express').Request} req The Express request
   * @param {import('express').Response} res The Express response
   */
  async create(req, res) {
    const record = await this.dicomRecordsService.create(req.file);
    res.status(201).json({data: serializeDICOMRecord(record)});
  }

  /**
   * Retrieve DICOM attribute value by tag
   *
   * @param {import('express').Request} req The Express request
   * @param {import('express').Response} res The Express response
   */
  async getDICOMAttribute(req, res) {
    const record = await this.dicomRecordsService.findById(req.params.id);

    if (!record) {
      res.status(404).json({
        errors: [
          new ValidationError({
            code: 'not_found',
            message: 'DICOM record not found',
          }),
        ],
      });
      return;
    }

    const ge = req.query.ge;
    const tag = await this.dicomRecordsService.getDICOMTag(record, ge);

    if (!tag) {
      res.status(404).json({
        errors: [
          new ValidationError({
            code: 'not_found',
            message: 'DICOM tag not found',
          }),
        ],
      });
      return;
    }

    res.status(200).json({data: serializeDICOMTag(tag, record)});
  }
}

module.exports = {DICOMRecordsController};
