const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(30)
});

module.exports = signupSchema;