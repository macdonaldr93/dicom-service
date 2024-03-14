const {DICOM_TAG_DICTIONARY} = require('../data/dicom-tag-dict');
const {DICOMFile} = require('../models/dicom-file');
const {DICOMRecord} = require('../models/dicom-record');
const {DICOMTag} = require('../models/dicom-tag');
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

    const newRecord = await this.findById(record.id, {
      include: [DICOMFile],
    });

    return newRecord;
  }

  findById(id, options) {
    return DICOMRecord.findByPk(id, options);
  }

  /**
   * Allows user to retrieve DICOM tag
   *
   * @param {object} record The DICOM record
   * @param {string} ge The group/element of the tag
   */
  getDICOMTag(record, tagGE) {
    const entry = Object.entries(DICOM_TAG_DICTIONARY).find(
      (pair) => tagGE === pair[1],
    );

    if (!entry) {
      return null;
    }

    const tagName = entry[0];
    const value = record[tagName];

    if (!value) {
      return null;
    }

    const tag = new DICOMTag({name: tagName, ge: tagGE, value});

    return tag;
  }

  /**
   * @param {Express.Multer.File} file The DICOM file
   * @private
   */
  async createDICOMFile(file) {
    const buffer = this.dicomReaderService.readDICOMFileAsBuffer(file.path);
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
