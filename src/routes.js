const {
  DICOMRecordsController,
} = require('./controllers/dicom-records-controller');

/**
 * Attach routes to Express app
 *
 * @param {import('express').Express} app The Express app
 */
function useRoutes(app) {
  const dicomRecordsController = new DICOMRecordsController();

  app
    .route('/dicom-records')
    .post((req, res) => dicomRecordsController.create(req, res));
}

module.exports = {useRoutes};
