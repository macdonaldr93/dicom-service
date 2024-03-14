const {
  DICOMRecordsService,
} = require('../../src/services/dicom-records-service');
const {db} = require('../../src/db');

describe('DICOMRecordsService', () => {
  beforeEach(async () => {
    await db.sync();
  });

  afterEach(async () => {
    await db.dropAllSchemas({});
  });

  describe('create()', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-14T00:00:00.000Z'));

    it('creates a DICOM file and record', async () => {
      // Given
      const file = {
        filename: '1',
        mimetype: 'application/octet-stream',
        originalname: 'IM0001',
        path: '/tmp/uploads/1',
        size: 312312,
      };
      const service = new DICOMRecordsService();

      // When
      const record = await service.create(file);

      // Then
      expect(record.toJSON()).toStrictEqual(
        expect.objectContaining({
          DICOMFile: expect.objectContaining({
            checksum: '',
            contentType: 'application/octet-stream',
            name: '1',
            originalName: 'IM0001',
            size: 312312,
            url: '/tmp/uploads/1',
          }),
        }),
      );
      expect(record.DICOMFile.createdAt.toISOString()).toBe(
        '2024-03-14T00:00:00.000Z',
      );
      expect(record.DICOMFile.updatedAt.toISOString()).toBe(
        '2024-03-14T00:00:00.000Z',
      );
      expect(record.createdAt.toISOString()).toBe('2024-03-14T00:00:00.000Z');
      expect(record.updatedAt.toISOString()).toBe('2024-03-14T00:00:00.000Z');
    });
  });
});
