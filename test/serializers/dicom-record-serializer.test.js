const {DICOMRecord} = require('../../src/models/dicom-record');
const {
  serializeDICOMRecord,
} = require('../../src/serializers/dicom-record-serializer');

describe('serializeDICOMRecord()', () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-03-14T00:00:00.000Z'));

  it('serializes the DICOM record to JSON', () => {
    const record = new DICOMRecord({
      fileOriginalName: 'IM00001',
      fileUploadedAt: new Date(),
      fileUrl: '/tmp/uploads/1',
    });

    expect(serializeDICOMRecord(record)).toStrictEqual({
      id: expect.any(String),
      fileUploadedAt: '2024-03-14T00:00:00.000Z',
      fileUrl: '/tmp/uploads/1',
    });
  });
});
