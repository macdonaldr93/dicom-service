const {DataTypes} = require('sequelize');

const {db} = require('../db');

/**
 * The DICOM file stored in blob storage
 */
const DICOMFile = db.define(
  'DICOMFile',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    checksum: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = {DICOMFile};
