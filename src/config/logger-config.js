const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_SERVICE_NAME = process.env.LOG_SERVICE_NAME || 'dicom-service';

module.exports = {LOG_LEVEL, LOG_SERVICE_NAME};
