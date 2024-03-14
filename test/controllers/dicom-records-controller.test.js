const {
  DICOMRecordsController,
} = require('../../src/controllers/dicom-records-controller');
const {DICOMRecord} = require('../../src/models/dicom-record');
const {
  DICOMRecordsService,
} = require('../../src/services/dicom-records-service');
const {db} = require('../../src/db');

describe('DICOMRecordsController', () => {
  beforeEach(async () => {
    await db.sync();
  });

  afterEach(async () => {
    await db.dropAllSchemas({});
  });

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

  describe('getTag()', () => {
    it('responds with a DICOM tag when record is found and ge matches', async () => {
      // Given
      const record = new DICOMRecord({
        InstitutionName: 'SUNNYVALE IMAGING CENTER',
      });
      await record.save();

      const dicomRecordsService = new DICOMRecordsService();
      const controller = new DICOMRecordsController({dicomRecordsService});
      const req = {
        params: {id: record.id},
        query: {ge: 'x00080080'},
      };
      const resStatus = jest.fn();
      const resJson = jest.fn();
      const res = {
        status: resStatus.mockImplementation(() => ({json: resJson})),
      };

      // When
      await controller.getTag(req, res);

      // Then
      expect(resStatus).toHaveBeenCalledWith(200);
      expect(resJson).toHaveBeenCalledWith({
        data: {
          id: 'x00100010',
          dicomRecordId: 1,
          ge: 'x00080080',
          name: 'InstitutionName',
          value: 'SUNNYVALE IMAGING CENTER',
        },
      });
    });

    it('responds with error when DICOM record is not found', async () => {
      // Given
      const dicomRecordsService = new DICOMRecordsService();
      const controller = new DICOMRecordsController({dicomRecordsService});
      const req = {params: {id: 41543452345}, query: {ge: 'x00080080'}};
      const resStatus = jest.fn();
      const resJson = jest.fn();
      const res = {
        status: resStatus.mockImplementation(() => ({json: resJson})),
      };

      // When
      await controller.getTag(req, res);

      // Then
      expect(resStatus).toHaveBeenCalledWith(404);
      expect(resJson).toHaveBeenCalledWith({
        errors: [{code: 'not_found', message: 'DICOM record not found'}],
      });
    });

    it('responds with error when DICOM tag is not found', async () => {
      // Given
      const record = new DICOMRecord({
        InstitutionName: 'SUNNYVALE IMAGING CENTER',
      });
      await record.save();

      const dicomRecordsService = new DICOMRecordsService();
      const controller = new DICOMRecordsController({dicomRecordsService});
      const req = {params: {id: record.id}, query: {ge: 'x12380080'}};
      const resStatus = jest.fn();
      const resJson = jest.fn();
      const res = {
        status: resStatus.mockImplementation(() => ({json: resJson})),
      };

      // When
      await controller.getTag(req, res);

      // Then
      expect(resStatus).toHaveBeenCalledWith(404);
      expect(resJson).toHaveBeenCalledWith({
        errors: [{code: 'not_found', message: 'DICOM tag not found'}],
      });
    });
  });
});
