const {
  DICOMRecordsService,
} = require('../../src/services/dicom-records-service');
const {db} = require('../../src/db');
const {DICOMTag} = require('../../src/models/dicom-tag');
const {DICOMReaderService} = require('../../src/services/dicom-reader-service');

describe('DICOMRecordsService', () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-03-14T00:00:00.000Z'));

  beforeEach(async () => {
    await db.sync();
  });

  afterEach(async () => {
    await db.dropAllSchemas({});
  });

  describe('create()', () => {
    it('creates a DICOM file and record', async () => {
      // Given
      const file = {
        filename: '1',
        mimetype: 'application/octet-stream',
        originalname: 'IM0001',
        path: '/tmp/uploads/1',
        size: 312312,
      };
      const readerService = new DICOMReaderService();
      const service = new DICOMRecordsService({
        dicomReaderService: readerService,
      });

      jest
        .spyOn(readerService, 'readDICOMFileAsBuffer')
        .mockImplementation(() => Buffer.from('1233'));
      jest
        .spyOn(readerService, 'parseDICOMFile')
        .mockImplementation(() => null);
      jest
        .spyOn(readerService, 'extractDICOMCommonTags')
        .mockImplementation(() => ({
          ImageType: new DICOMTag({
            ge: 'x00080008',
            name: 'ImageType',
            value: 'ORIGINAL\\PRIMARY',
          }),
          SOPClassUID: new DICOMTag({
            ge: 'x00080016',
            name: 'SOPClassUID',
            value: '1.2.840.10008.5.1.4.1.1.1.1.1',
          }),
          SOPInstanceUID: new DICOMTag({
            ge: 'x00080018',
            name: 'SOPInstanceUID',
            value:
              '1.2.826.0.1.3680043.2.1074.5931521980486637439720462877894121211',
          }),
          AccessionNumber: new DICOMTag({
            ge: 'x00080050',
            name: 'AccessionNumber',
            value: '135490-1',
          }),
          Manufacturer: new DICOMTag({
            ge: 'x00080070',
            name: 'Manufacturer',
            value: 'iCRco',
          }),
          InstitutionName: new DICOMTag({
            ge: 'x00080080',
            name: 'InstitutionName',
            value: 'SUNNYVALE IMAGING CENTER',
          }),
          InstitutionAddress: new DICOMTag({
            ge: 'x00080081',
            name: 'InstitutionAddress',
            value: '568 S MATHILDA AVE SUNNYVA CA 94086',
          }),
          ReferringPhysicianName: new DICOMTag({
            ge: 'x00080090',
            name: 'ReferringPhysicianName',
            value: 'BROOKE DIX^DPM^',
          }),
          PatientName: new DICOMTag({
            ge: 'x00100010',
            name: 'PatientName',
            value: 'NAYYAR^HARSH',
          }),
          PatientID: new DICOMTag({
            ge: 'x00100020',
            name: 'PatientID',
            value: '5184',
          }),
          PatientSex: new DICOMTag({
            ge: 'x00100040',
            name: 'PatientSex',
            value: 'M',
          }),
        }));

      // When
      const record = await service.create(file);

      // Then
      expect(record.toJSON()).toStrictEqual(
        expect.objectContaining({
          AccessionNumber: '135490-1',
          ImageType: 'ORIGINAL\\PRIMARY',
          InstitutionAddress: '568 S MATHILDA AVE SUNNYVA CA 94086',
          InstitutionName: 'SUNNYVALE IMAGING CENTER',
          Manufacturer: 'iCRco',
          PatientID: '5184',
          PatientName: 'NAYYAR^HARSH',
          PatientSex: 'M',
          ReferringPhysicianName: 'BROOKE DIX^DPM^',
          SOPClassUID: '1.2.840.10008.5.1.4.1.1.1.1.1',
          SOPInstanceUID:
            '1.2.826.0.1.3680043.2.1074.5931521980486637439720462877894121211',
          DICOMFile: expect.objectContaining({
            checksum:
              '4654d793972c3b6a1d48fb0ab58d9cb0de46c3d33d605f9222c283dfaa12d420',
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
