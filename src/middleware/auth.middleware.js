const jwt = require('jsonwebtoken');
const User = require('../modules/users/user.model');
const HttpException = require('../common/exceptions/http.exception');
const jwtConfig = require('../config/jwt.config');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new HttpException('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);

    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new HttpException('Not authorized to access this route', 401));
  }
};