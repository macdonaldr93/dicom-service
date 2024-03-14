const {readFileSync, existsSync} = require('fs');

const dicomParser = require('dicom-parser');

const {logger} = require('../logger');
const {DICOM_COMMON_TAG_DICTIONARY} = require('../data/dicom-tag-dict');
const {DICOMTag} = require('../models/dicom-tag');

/**
 * Service for reading DICOM files
 */
class DICOMReaderService {
  constructor() {
    this.logger = logger.child({module: 'DICOMReaderService'});
  }

  /**
   * Parses the DataSet from the DICOM file
   *
   * @param {string} filePath File path to DICOM file
   * @returns {dicomParser.DataSet} DataSet parsed from dicom-parser
   */
  parseDICOMFile(filePath) {
    const buffer = this.readDICOMFileAsBuffer(filePath);

    if (!buffer) {
      this.logger.error('Failed to read DICOM file', {filePath});
      return null;
    }

    const dataSet = this.#parseDICOMFromBuffer(buffer);

    return dataSet;
  }

  readDICOMFileAsBuffer(filePath) {
    if (existsSync(filePath)) {
      return readFileSync(filePath);
    } else {
      this.logger.error('DICOM file not found', {filePath});
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
