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
function useRoutes(deps, app) {
  const {
    dicomFileUploadService,
    dicomGetAttributeValidator,
    dicomRecordCreateValidator,
    dicomRecordsController,
  } = deps;

  app
    .route('/dicom-records')
    .post(
      [
        dicomFileUploadService.middleware(),
        dicomRecordCreateValidator.middleware(),
      ],
      (req, res) => dicomRecordsController.create(req, res),
    );

  app
    .route('/dicom-records/:id/attr')
    .get(dicomGetAttributeValidator.middleware(), (req, res) =>
      dicomRecordsController.getDICOMAttribute(req, res),
    );
}

module.exports = {useRoutes};
