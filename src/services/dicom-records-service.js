const {readFileSync} = require('fs');

const {DICOMFile} = require('../models/dicom-file');
const {DICOMRecord} = require('../models/dicom-record');
const {generateFileChecksum} = require('../utils/file-utils');

/**
 * DICOM records service
 */
class DICOMRecordsService {
  /**
   * Allows user to create DICOM records
   *
   * @param {Express.Multer.File} file The DICOM file
   */
  async create(file) {
    const dicomFile = await this.createDICOMFile(file);
    const record = new DICOMRecord();

    record.setDICOMFile(dicomFile);
    await record.save();

    const newRecord = await DICOMRecord.findByPk(record.id, {
      include: [DICOMFile],
    });

    return newRecord;
  }

  /**
   * @param {Express.Multer.File} file The DICOM file
   * @private
   */
  async createDICOMFile(file) {
    const buffer = this.readDICOMFile(file);
    const checksum = generateFileChecksum(buffer);
    const dicomFile = new DICOMFile({
      checksum,
      contentType: file.mimetype,
      name: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: file.path,
    });
    await dicomFile.save();

    return dicomFile;
  }

  /**
   * @param {Express.Multer.File} file The DICOM file
   * @private
   */
  readDICOMFile(file) {
    return readFileSync(file.path);
  }
}

module.exports = {DICOMRecordsService};
