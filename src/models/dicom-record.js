const {DataTypes} = require('sequelize');

const {db} = require('../db');

const {DICOMFile} = require('./dicom-file');

/**
 * The DICOM record for metadata and reference to file
 */
const DICOMRecord = db.define(
  'DICOMRecord',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
  },
);

DICOMRecord.belongsTo(DICOMFile);

module.exports = {DICOMRecord};
