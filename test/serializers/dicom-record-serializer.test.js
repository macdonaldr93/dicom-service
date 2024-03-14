const {DICOMFile} = require('../../src/models/dicom-file');
const {DICOMRecord} = require('../../src/models/dicom-record');
const {
  serializeDICOMRecord,
} = require('../../src/serializers/dicom-record-serializer');

describe('serializeDICOMRecord()', () => {
  it('serializes the DICOM record to JSON', () => {
    const now = new Date('2024-03-14T00:00:00.000Z');
    const dicomFile = new DICOMFile({
      checksum: '',
      contentType: 'application/octet-stream',
      name: '1',
      originalName: 'IM0001',
      size: 312312,
      url: '/tmp/uploads/1',
      createdAt: now,
      updatedAt: now,
    });
    const record = new DICOMRecord({createdAt: now, updatedAt: now});
    record.DICOMFile = dicomFile;

    expect(serializeDICOMRecord(record)).toStrictEqual({
      createdAt: '2024-03-14T00:00:00.000Z',
      dicomFile: {
        checksum: '',
        contentType: 'application/octet-stream',
        name: '1',
        originalName: 'IM0001',
        size: 312312,
        url: '/tmp/uploads/1',
      },
      id: null,
      updatedAt: '2024-03-14T00:00:00.000Z',
    });
  });
});
