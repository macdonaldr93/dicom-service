/**
 * Serializes a DICOM tag
 *
 * @param {object} record The DICOM record with DICOM file eager-loaded
 *
 * @returns {object} The serialized DICOM record and file
 */
function serializeDICOMTag(tag, record) {
  return {
    name: tag.name,
    ge: tag.ge,
    value: tag.value,
    dicomRecordId: record.id,
  };
}

module.exports = {serializeDICOMTag};
