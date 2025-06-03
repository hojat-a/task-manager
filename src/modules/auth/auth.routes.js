const express = require('express');
const { signup, login } = require('./auth.controller');
const validate = require('../../middleware/validation.middleware');
const signupDto = require('./dto/signup.dto');
const loginDto = require('./dto/login.dto');

const router = express.Router();

router.post('/signup', validate(signupDto), signup);
router.post('/login', validate(loginDto), login);

module.exports = router;