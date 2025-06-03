const ValidationException = require('../common/exceptions/validation.exception');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorDetails = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      
      return next(new ValidationException('Validation failed', errorDetails));
    }
    
    next();
  };
};

module.exports = validate;