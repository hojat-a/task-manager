const Joi = require('joi');

const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string(),
  status: Joi.string().valid('pending', 'in-progress', 'done')
}).min(1); // At least one field must be provided

module.exports = updateTaskSchema;