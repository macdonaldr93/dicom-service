const {DICOMFile} = require('../models/dicom-file');
const {DICOMRecord} = require('../models/dicom-record');
const {generateFileChecksum} = require('../utils/file-utils');

/**
 * DICOM records service
 */
class DICOMRecordsService {
  /**
   *
   * @param {object} deps Injected dependencies
   * @param {import('./dicom-reader-service').DICOMReaderService} deps.dicomReaderService The DICOM reader service
   */
  constructor(deps = {}) {
    this.dicomReaderService = deps.dicomReaderService;
  }

  /**
   * Allows user to create DICOM records
   *
   * @param {Express.Multer.File} file The DICOM file
   */
  async create(file) {
    const dicomFile = await this.createDICOMFile(file);
    const dicomData = this.dicomReaderService.parseDICOMFile(file.path);
    const dicomTags = this.dicomReaderService.extractDICOMCommonTags(dicomData);

    const record = new DICOMRecord({
      DICOMFileId: dicomFile.id,
      AccessionNumber: dicomTags.AccessionNumber?.value,
      ImageType: dicomTags.ImageType?.value,
      InstitutionAddress: dicomTags.InstitutionAddress?.value,
      InstitutionName: dicomTags.InstitutionName?.value,
      Manufacturer: dicomTags.Manufacturer?.value,
      PatientID: dicomTags.PatientID?.value,
      PatientName: dicomTags.PatientName?.value,
      PatientSex: dicomTags.PatientSex?.value,
      ReferringPhysicianName: dicomTags.ReferringPhysicianName?.value,
      SOPClassUID: dicomTags.SOPClassUID?.value,
      SOPInstanceUID: dicomTags.SOPInstanceUID?.value,
    });

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
    const buffer = this.dicomReaderService.readDICOMFileAsBuffer(file);
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
}

module.exports = {DICOMRecordsService};
