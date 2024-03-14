/**
 * DICOM tag model
 */
class DICOMTag {
  constructor(attrs = {}) {
    /**
     * The human-readable tag name
     * @type {string}
     */
    this.name = attrs.name;
    /**
     * The group/element (i.e. xGGGGEEEE)
     * @type {string}
     */
    this.ge = attrs.ge;
    /**
     * The value
     * @type {string}
     */
    this.value = attrs.value;
  }

  /**
   * Serialize to JSON
   */
  toJSON() {
    return {
      name: this.name,
      ge: this.ge,
      value: this.value,
    };
  }
}

module.exports = {DICOMTag};
