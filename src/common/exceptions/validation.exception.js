const HttpException = require('./http.exception');

class ValidationException extends HttpException {
  constructor(message = 'Validation failed', errors = {}) {
    super(message, 400);
    this.errors = errors;
  }
}

module.exports = ValidationException;