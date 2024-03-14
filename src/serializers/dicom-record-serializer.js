/**
 * Serializes a DICOM record and file
 *
 * @param {import('../models/dicom-record')} record The DICOM record with DICOM file eager-loaded
 *
 * @returns {object} The serialized DICOM record and file
 */
function serializeDICOMRecord(record) {
  return {
    id: record.id,
    dicomFile: {
      checksum: record.DICOMFile.checksum,
      contentType: record.DICOMFile.contentType,
      name: record.DICOMFile.name,
      originalName: record.DICOMFile.originalName,
      size: record.DICOMFile.size,
      url: record.DICOMFile.url,
    },
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

module.exports = {serializeDICOMRecord};
