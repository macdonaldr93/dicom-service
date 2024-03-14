const DICOM_TAG_DICTIONARY = {
  AccessionNumber: 'x00080050',
  Columns: 'x00280011',
  ImageType: 'x00080008',
  InstitutionAddress: 'x00080081',
  InstitutionName: 'x00080080',
  Manufacturer: 'x00080070',
  PatientID: 'x00100020',
  PatientName: 'x00100010',
  PatientSex: 'x00100040',
  PixelData: 'x7fe00010',
  ReferringPhysicianName: 'x00080090',
  Rows: 'x00280010',
  SOPClassUID: 'x00080016',
  SOPInstanceUID: 'x00080018',
  WindowCenter: 'x00281050',
  WindowWidth: 'x00281051',
};

const DICOM_COMMON_TAG_DICTIONARY = {
  AccessionNumber: 'x00080050',
  ImageType: 'x00080008',
  InstitutionAddress: 'x00080081',
  InstitutionName: 'x00080080',
  Manufacturer: 'x00080070',
  PatientID: 'x00100020',
  PatientName: 'x00100010',
  PatientSex: 'x00100040',
  ReferringPhysicianName: 'x00080090',
  SOPClassUID: 'x00080016',
  SOPInstanceUID: 'x00080018',
};

module.exports = {DICOM_TAG_DICTIONARY, DICOM_COMMON_TAG_DICTIONARY};
