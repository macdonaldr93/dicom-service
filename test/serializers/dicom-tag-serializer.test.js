const {DICOMRecord} = require('../../src/models/dicom-record');
const {DICOMTag} = require('../../src/models/dicom-tag');
const {
  serializeDICOMTag,
} = require('../../src/serializers/dicom-tag-serializer');

describe('serializeDICOMTag()', () => {
  it('serializes the DICOM tag to JSON', () => {
    const now = new Date('2024-03-14T00:00:00.000Z');
    const tag = new DICOMTag({
      name: 'PatientName',
      ge: 'x00100010',
      value: 'John Smith',
    });
    const record = new DICOMRecord({id: 1, createdAt: now, updatedAt: now});

    expect(serializeDICOMTag(tag, record)).toStrictEqual({
      dicomRecordId: 1,
      ge: 'x00100010',
      name: 'PatientName',
      value: 'John Smith',
    });
  });
});
