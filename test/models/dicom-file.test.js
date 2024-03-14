const {DICOMFile} = require('../../src/models/dicom-file');

describe('DICOMFile', () => {
  it('validates file before saving', async () => {
    const file = new DICOMFile();
    const errors = [];

    try {
      await file.validate();
    } catch (error) {
      error.errors.forEach((err) => {
        errors.push(err.message);
      });
    }

    expect(errors).toStrictEqual([
      'DICOMFile.contentType cannot be null',
      'DICOMFile.name cannot be null',
      'DICOMFile.originalName cannot be null',
      'DICOMFile.url cannot be null',
    ]);
  });
});
