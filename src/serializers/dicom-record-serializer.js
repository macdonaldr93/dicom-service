function serializeDICOMRecord(dicomRecord) {
  return {
    id: dicomRecord.id,
  };
}

module.exports = {serializeDICOMRecord};
