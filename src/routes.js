/**
 * Attach routes to Express app
 *
 * @param {object} deps The injected dependencies
 * @param {DICOMRecordsController} deps.dicomRecordsController The DICOM records controller
 * @param {import('express').Express} app The Express app
 */
function useRoutes(deps, app) {
  const {dicomRecordsController, fileUploadService} = deps;

  app
    .route('/dicom-records')
    .post(
      fileUploadService.middleware(dicomRecordsController.fileUploadAttribute),
      (req, res) => dicomRecordsController.create(req, res),
    );
}

module.exports = {useRoutes};
