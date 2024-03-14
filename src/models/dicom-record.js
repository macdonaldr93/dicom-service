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
    AccessionNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ImageType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    InstitutionAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    InstitutionName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Manufacturer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PatientID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PatientName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PatientSex: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ReferringPhysicianName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    SOPClassUID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    SOPInstanceUID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

DICOMRecord.belongsTo(DICOMFile);

module.exports = {DICOMRecord};
