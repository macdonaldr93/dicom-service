const {
  DICOMGetAttributeValidator,
} = require('../../src/validators/dicom-get-attribute-validator');

describe('DICOMRecordCreateValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new DICOMGetAttributeValidator();
  });

  describe('validate()', () => {
    it('requires a "ge" query parameter', () => {
      const req = {query: {}};
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
            field: 'ge',
            message: 'ge (Group/Element) query parameter is required',
          },
        ],
      });
    });

    it('continues to next middleware when request has ge query param', () => {
      const req = {query: {ge: 'x00100010'}};
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
