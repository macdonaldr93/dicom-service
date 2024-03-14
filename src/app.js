const express = require('express');

const {
  FILE_UPLOAD_DESTINATION,
  FILE_UPLOAD_MAX_SIZE,
} = require('./config/file-upload-config');
const {
  DICOMRecordsController,
} = require('./controllers/dicom-records-controller');
const {FileUploadService} = require('./services/file-upload-service');
const {
  DICOMRecordCreateValidator,
} = require('./validators/dicom-record-create-validator');
const {useRoutes} = require('./routes');

const dicomRecordsController = new DICOMRecordsController();
const dicomRecordCreateValidator = new DICOMRecordCreateValidator({
  fileFieldName: dicomRecordsController.fileUploadFieldName,
});
const dicomFileUploadService = new FileUploadService({
  destination: FILE_UPLOAD_DESTINATION,
  fileFieldName: dicomRecordsController.fileUploadFieldName,
  fileMaxSize: FILE_UPLOAD_MAX_SIZE,
});

const app = express();

useRoutes(
  {
    dicomFileUploadService,
    dicomRecordCreateValidator,
    dicomRecordsController,
  },
  app,
);

module.exports = {app};
