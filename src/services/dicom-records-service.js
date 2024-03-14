const {DICOMFile} = require('../models/dicom-file');
const {DICOMRecord} = require('../models/dicom-record');

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
    const dicomFile = new DICOMFile({
      checksum: '',
      contentType: file.mimetype,
      name: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: file.path,
    });
    await dicomFile.save();

    const record = new DICOMRecord();
    record.setDICOMFile(dicomFile);
    await record.save();

    const newRecord = await DICOMRecord.findByPk(record.id, {
      include: [DICOMFile],
    });

    return newRecord;
  }
}

module.exports = {DICOMRecordsService};
