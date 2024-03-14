const {DICOMRecord} = require('../models/dicom-record');
const {
  serializeDICOMRecord,
} = require('../serializers/dicom-record-serializer');

/**
 * DICOM records controller
 */
class DICOMRecordsController {
  constructor() {
    this.fileUploadFieldName = 'dicomFile';
  }

  /**
   * Allows user to create DICOM records
   *
   * @param {import('express').Request} req The Express request
   * @param {import('express').Response} res The Express response
   */
  create(req, res) {
    const record = DICOMRecord.fromFile(req.file);

    res.status(201).json({data: serializeDICOMRecord(record)});
  }
}

module.exports = {DICOMRecordsController};
