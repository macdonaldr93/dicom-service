const express = require('express');

const {
  FILE_UPLOAD_DESTINATION,
  FILE_UPLOAD_MAX_SIZE,
} = require('./config/file-upload-config');
const {
  DICOMRecordsController,
} = require('./controllers/dicom-records-controller');
const {FileUploadService} = require('./services/file-upload-service');
const {useRoutes} = require('./routes');

const fileUploadService = new FileUploadService({
  destination: FILE_UPLOAD_DESTINATION,
  maxFileSize: FILE_UPLOAD_MAX_SIZE,
});
const dicomRecordsController = new DICOMRecordsController();

const app = express();

useRoutes({dicomRecordsController, fileUploadService}, app);

module.exports = {app};
