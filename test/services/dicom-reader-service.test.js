const path = require('path');

const {DICOMReaderService} = require('../../src/services/dicom-reader-service');
const {DICOMTag} = require('../../src/models/dicom-tag');

describe('DICOMReaderService', () => {
  const dicomReaderService = new DICOMReaderService();
  const mockDicomFilePath = path.join(__dirname, '../fixtures/dicom/IM000001');

  describe('parseDICOMFile()', () => {
    it('reads a DICOM file based on the file path', () => {
      const dataSet = dicomReaderService.parseDICOMFile(mockDicomFilePath);

      expect(dataSet).toBeDefined();
      expect(dataSet.string('x00100040')).toBe('M');
    });

    it("returns null when the file doesn't exist", () => {
      const dataSet = dicomReaderService.parseDICOMFile('./foo');

      expect(dataSet).toBeNull();
    });
  });

  describe('extractDICOMCommonTags()', () => {
    it('extracts common tags from DICOM file', () => {
      const dataSet = dicomReaderService.parseDICOMFile(mockDicomFilePath);
      const tags = dicomReaderService.extractDICOMCommonTags(dataSet);

      expect(tags).toStrictEqual({
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
      });
    });
  });
});
