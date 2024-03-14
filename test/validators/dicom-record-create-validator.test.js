const {
  DICOMRecordCreateValidator,
} = require('../../src/validators/dicom-record-create-validator');

describe('DICOMRecordCreateValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new DICOMRecordCreateValidator({fileFieldName: 'file'});
  });

  describe('validate()', () => {
    it('requires the file to be uploaded on the request', () => {
      const req = {};
      const resStatus = jest.fn();
      const resJson = jest.fn();
      const res = {
        status: resStatus.mockImplementation(() => ({json: resJson})),
      };
      const next = jest.fn();

      validator.validate(req, res, next);

      expect(resStatus).toHaveBeenCalledWith(422);
      expect(resJson).toHaveBeenCalledWith({
        errors: [
          {
            code: 'required',
            field: 'file',
            message: 'A file is required',
          },
        ],
      });
    });

    it('continues to next middleware when request is valid with a file', () => {
      const req = {
        file: true,
      };
      const resStatus = jest.fn();
      const resJson = jest.fn();
      const res = {
        status: resStatus.mockImplementation(() => ({json: resJson})),
      };
      const next = jest.fn();

      validator.validate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(resStatus).not.toHaveBeenCalled();
    });
  });
});
