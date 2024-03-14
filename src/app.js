const express = require('express');
const pinoHttp = require('pino-http');

const {
  FILE_UPLOAD_DESTINATION,
  FILE_UPLOAD_MAX_SIZE,
} = require('./config/file-upload-config');
const {
  DICOMRecordsController,
} = require('./controllers/dicom-records-controller');
const {FileUploadService} = require('./services/file-upload-service');
const {DICOMReaderService} = require('./services/dicom-reader-service');
const {DICOMRecordsService} = require('./services/dicom-records-service');
const {DICOMViewerService} = require('./services/dicom-viewer-service');
const {
  DICOMRecordCreateValidator,
} = require('./validators/dicom-record-create-validator');
const {buildRoutes} = require('./routes');
const {
  DICOMGetAttributeValidator,
} = require('./validators/dicom-get-attribute-validator');

const dicomReaderService = new DICOMReaderService();
const dicomRecordsService = new DICOMRecordsService({dicomReaderService});
const dicomViewerService = new DICOMViewerService({dicomReaderService});
const dicomRecordsController = new DICOMRecordsController({
  dicomRecordsService,
  dicomViewerService,
});
const dicomGetAttributeValidator = new DICOMGetAttributeValidator();
const dicomRecordCreateValidator = new DICOMRecordCreateValidator({
  fileFieldName: dicomRecordsController.fileUploadFieldName,
});
const dicomFileUploadService = new FileUploadService({
  destination: FILE_UPLOAD_DESTINATION,
  fileFieldName: dicomRecordsController.fileUploadFieldName,
  fileMaxSize: FILE_UPLOAD_MAX_SIZE,
});

const app = express();

app.use(pinoHttp());

const routes = buildRoutes({
  dicomFileUploadService,
  dicomGetAttributeValidator,
  dicomRecordCreateValidator,
  dicomRecordsController,
});

app.use('/api/2024-03', routes);

module.exports = {app};
