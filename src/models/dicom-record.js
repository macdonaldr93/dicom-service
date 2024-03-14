const {v4} = require('uuid');

class DICOMRecord {
  constructor(attrs = {}) {
    this.id = attrs.id || v4();
  }
}

module.exports = {DICOMRecord};
