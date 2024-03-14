function serializeDICOMRecord(dicomRecord) {
  return {
    id: dicomRecord.id,
    fileUploadedAt: dicomRecord.fileUploadedAt
      ? dicomRecord.fileUploadedAt.toISOString()
      : null,
    fileUrl: dicomRecord.fileUrl,
  };
}

module.exports = {serializeDICOMRecord};
