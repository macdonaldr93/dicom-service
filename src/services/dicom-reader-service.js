const {readFileSync, existsSync} = require('fs');

const dicomParser = require('dicom-parser');

const {DICOMTag} = require('../models/dicom-tag');

const DICOM_COMMON_TAG_DICTIONARY = {
  AccessionNumber: 'x00080050',
  ImageType: 'x00080008',
  InstitutionAddress: 'x00080081',
  InstitutionName: 'x00080080',
  Manufacturer: 'x00080070',
  PatientID: 'x00100020',
  PatientName: 'x00100010',
  PatientSex: 'x00100040',
  ReferringPhysicianName: 'x00080090',
  SOPClassUID: 'x00080016',
  SOPInstanceUID: 'x00080018',
};

/**
 * Service for reading DICOM files
 */
class DICOMReaderService {
  /**
   * Parses the DataSet from the DICOM file
   *
   * @param {string} filePath File path to DICOM file
   * @returns {dicomParser.DataSet} DataSet parsed from dicom-parser
   */
  parseDICOMFile(filePath) {
    const buffer = this.readDICOMFileAsBuffer(filePath);

    if (!buffer) {
      return null;
    }

    const dataSet = this.#parseDICOMFromBuffer(buffer);

    return dataSet;
  }

  readDICOMFileAsBuffer(filePath) {
    if (existsSync(filePath)) {
      return readFileSync(filePath);
    } else {
      return null;
    }
  }

  /**
   * Extract commonly requested DICOM tags
   *
   * @param {dicomParser.DataSet} dataSet DataSet parsed from dicom-parser
   * @returns {object} Common DICOM tags
   */
  extractDICOMCommonTags(dataSet) {
    const data = {};

    for (const tagName in DICOM_COMMON_TAG_DICTIONARY) {
      if (!Object.hasOwn(DICOM_COMMON_TAG_DICTIONARY, tagName)) {
        continue;
      }

      const ge = DICOM_COMMON_TAG_DICTIONARY[tagName];
      const value = dataSet.string(DICOM_COMMON_TAG_DICTIONARY[tagName]);
      const tag = new DICOMTag({name: tagName, ge, value});

      if (value) {
        data[tagName] = tag;
      } else {
        data[tagName] = null;
      }
    }

    return data;
  }

  #parseDICOMFromBuffer(buffer) {
    return dicomParser.parseDicom(buffer);
  }
}

module.exports = {DICOMReaderService};
