const authService = require('./auth.service');
const ApiResponse = require('../../common/utils/response');
const asyncHandler = require('../../common/utils/async-handler');

exports.signup = asyncHandler(async (req, res) => {
  const userData = req.body;
  const result = await authService.signup(userData);
  return ApiResponse.success(result, 'User registered successfully', 201).send(res);
});

exports.login = asyncHandler(async (req, res) => {
  const credentials = req.body;
  const result = await authService.login(credentials);
  return ApiResponse.success(result, 'Login successful').send(res);
});