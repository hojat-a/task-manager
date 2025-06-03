const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required(),
  status: Joi.string().valid('pending', 'in-progress', 'done').default('pending')
});

module.exports = createTaskSchema;