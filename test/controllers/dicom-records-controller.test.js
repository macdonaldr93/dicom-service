const {
  DICOMRecordsController,
} = require('../../src/controllers/dicom-records-controller');
const {DICOMRecord} = require('../../src/models/dicom-record');

describe('DICOMRecordsController', () => {
  describe('create()', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-14T00:00:00.000Z'));

    it('responds with a DICOM record when DICOM file is valid', async () => {
      // Given
      const now = new Date();
      const dicomeFile = {
        id: 2,
        checksum: '',
        contentType: 'application/octet-stream',
        name: '1',
        originalName: 'IM0001',
        size: 312312,
        url: '/tmp/uploads/1',
        createdAt: now,
        updatedAt: now,
      };
      const dicomRecord = new DICOMRecord({
        id: 1,
        createdAt: now,
        updatedAt: now,
      });
      dicomRecord.DICOMFile = dicomeFile;
      const dicomRecordsService = {
        create: jest.fn().mockResolvedValue(dicomRecord),
      };
      const controller = new DICOMRecordsController({dicomRecordsService});
      const req = {};
      const resStatus = jest.fn();
      const resJson = jest.fn();
      const res = {
        status: resStatus.mockImplementation(() => ({json: resJson})),
      };

      // When
      await controller.create(req, res);

      // Then
      expect(resStatus).toHaveBeenCalledWith(201);
      expect(resJson).toHaveBeenCalledWith({
        data: {
          dicomFile: {
            checksum: '',
            contentType: 'application/octet-stream',
            name: '1',
            originalName: 'IM0001',
            size: 312312,
            url: '/tmp/uploads/1',
          },
          id: 1,
          createdAt: '2024-03-14T00:00:00.000Z',
          updatedAt: '2024-03-14T00:00:00.000Z',
        },
      });
    });
  });
});
