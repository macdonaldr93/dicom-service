const {
  serializeDICOMRecord,
} = require('../serializers/dicom-record-serializer');

/**
 * DICOM records controller
 */
class DICOMRecordsController {
  /**
   *
   * @param {object} deps Injected dependencies
   * @param {import('../services/dicom-records-service')} dicomRecordsService The DICOM records service
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
}

module.exports = {DICOMRecordsController};
