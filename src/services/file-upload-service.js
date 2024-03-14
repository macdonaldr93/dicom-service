const multer = require('multer');
const {v4} = require('uuid');

/**
 * Service for uploading files to a store
 */
class FileUploadService {
  /**
   * @param {object} options File upload service options
   * @param {string} options.destination Destination the files will be uploaded on disk
   * @param {number} options.fileMaxSize File max size for an upload
   * @param {string} options.fileFieldName The field name on the Express request body for the file
   */
  constructor(options = {}) {
    const destination = options.destination || 'tmp/uploads/';
    const fileMaxSize = options.fileMaxSize;
    const storage = multer.diskStorage({
      destination,
      filename: (_req, _file, cb) => {
        cb(null, v4());
      },
    });

    this.fileFieldName = options.fileFieldName || 'file';
    this.uploader = multer({
      storage,
      ...(fileMaxSize
        ? {
            limits: {fileSize: fileMaxSize},
          }
        : {}),
    });
    this.middleware = this.middleware.bind(this);
  }

  middleware() {
    return this.uploader.single(this.fileFieldName);
  }
}

module.exports = {FileUploadService};
