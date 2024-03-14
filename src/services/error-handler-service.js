const {logger} = require('../logger');
const {ValidationError} = require('../models/validation-error');

/**
 * Service for handling top-level errors in Express
 */
class ErrorHandlerService {
  constructor() {
    this.logger = logger.child({module: 'ErrorHandlerService'});
    this.middleware = this.middleware.bind(this);
  }

  middleware() {
    return (err, _req, res, next) => {
      if (process.env.NODE_ENV !== 'production') {
        return next(err);
      }

      // Log to error reporter
      this.logger.error('Internal service error', {err});

      return res.status(500).json({
        errors: [
          new ValidationError({
            code: 'internal_error',
            message: 'Internal service error',
          }),
        ],
      });
    };
  }
}

module.exports = {ErrorHandlerService};
