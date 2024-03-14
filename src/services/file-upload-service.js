const multer = require('multer');
const {v4} = require('uuid');

/**
 * Service for uploading files to a store
 */
class FileUploadService {
  /**
   * @param {object} options File upload service options
   * @param {string} options.destination Destination the files will be uploaded on disk
   * @param {number} options.maxFileSize Max file size for an upload
   *
   */
  constructor(options = {}) {
    const destination = options.destination || 'tmp/uploads/';
    const maxFileSize = options.maxFileSize;
    const storage = multer.diskStorage({
      destination,
      filename: (_req, _file, cb) => {
        cb(null, v4());
      },
    });

    this.uploader = multer({
      storage,
      ...(maxFileSize
        ? {
            limits: {fileSize: maxFileSize},
          }
        : {}),
    });
  }

  /**
   * @param {string} attribute Name of the multipart form field to process.
   */
  middleware(attribute = 'file') {
    return this.uploader.single(attribute);
  }
}

module.exports = {FileUploadService};
