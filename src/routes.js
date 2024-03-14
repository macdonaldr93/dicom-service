const express = require('express');

/**
 * Attach routes to Express app
 *
 * @param {object} deps The injected dependencies
 * @param {import('./controllers/dicom-records-controller').DICOMRecordsController} deps.dicomRecordsController The DICOM records controller
 * @param {import('./services/file-upload-service').FileUploadService} deps.dicomFileUploadService The DICOM file upload service
 * @param {import('./validators/dicom-get-attribute-validator').DICOMGetAttributeValidator} deps.dicomGetAttributeValidator The DICOM get attribute validator
 * @param {import('./validators/dicom-record-create-validator').DICOMRecordCreateValidator} deps.dicomRecordCreateValidator The DICOM record create validator
 * @param {import('express').Express} app The Express app
 */
function buildRoutes(deps) {
  const router = express.Router();

  const {
    dicomFileUploadService,
    dicomGetAttributeValidator,
    dicomRecordCreateValidator,
    dicomRecordsController,
  } = deps;

  router
    .route('/dicom-records')
    .post(
      [
        dicomFileUploadService.middleware(),
        dicomRecordCreateValidator.middleware(),
      ],
      (req, res, next) => dicomRecordsController.create(req, res, next),
    );

  router.route('/dicom-records/:id.png').get((req, res, next) => {
    dicomRecordsController.viewAsImage(req, res, next);
  });

  router
    .route('/dicom-records/:id/attr')
    .get(dicomGetAttributeValidator.middleware(), (req, res, next) =>
      dicomRecordsController.getTag(req, res, next),
    );

  return router;
}

module.exports = {buildRoutes};
