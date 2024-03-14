/**
 * Validation error model.
 */
class ValidationError {
  constructor(attrs = {}) {
    /**
     * The error code
     * @type {string}
     */
    this.code = attrs.code;
    /**
     * The field where the error happpened
     * @type {?string}
     */
    this.field = attrs.field;
    /**
     * The human-readable error message
     * @type {string}
     */
    this.message = attrs.message;
  }

  /**
   * Serialize error to JSON for response
   */
  toJSON() {
    if (!this.field) {
      return {
        code: this.code,
        message: this.message,
      };
    }

    return {
      code: this.code,
      field: this.field,
      message: this.message,
    };
  }
}

module.exports = {ValidationError};
