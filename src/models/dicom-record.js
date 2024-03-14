const {v4} = require('uuid');

class DICOMRecord {
  /**
   *
   * @param {Express.Multer.File} file Uploaded file
   */
  static fromFile(file) {
    return new DICOMRecord({
      fileOriginalName: file.originalname,
      fileUploadedAt: new Date(),
      fileUrl: file.path,
    });
  }

  constructor(attrs = {}) {
    this.id = attrs.id || v4();
    this.fileOriginalName = attrs.fileOriginalName || null;
    this.fileUrl = attrs.fileUrl || null;
    this.fileUploadedAt = attrs.fileUploadedAt || null;
  }
}

module.exports = {DICOMRecord};
