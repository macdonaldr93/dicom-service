const {DICOMRecord} = require('../../src/models/dicom-record');

describe('DICOMRecord', () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-03-14T00:00:00.000Z'));

  it("assigns an id if one isn't provided", () => {
    const record = new DICOMRecord();

    expect(record.id).toBeDefined();
  });

  describe('fromFile()', () => {
    it('assigns the file attributes', () => {
      const mockFile = {
        originalname: 'IM0001',
        path: '/tmp/uploads/b87cdc09-1d32-4db2-a34c-ec479e391f9e',
      };
      const record = DICOMRecord.fromFile(mockFile);

      expect(record.id).toBeDefined();
      expect(record.fileUploadedAt.toISOString()).toBe(
        '2024-03-14T00:00:00.000Z',
      );
      expect(record.fileOriginalName).toBe('IM0001');
      expect(record.fileUrl).toBe(
        '/tmp/uploads/b87cdc09-1d32-4db2-a34c-ec479e391f9e',
      );
    });
  });
});
