const bcrypt = require('bcryptjs');
const User = require('../users/user.model');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt.config');
const HttpException = require('../../common/exceptions/http.exception');

class AuthService {
  async signup(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return this.generateTokenResponse(user);
  }

  async login(credentials) {
    const { email, password } = credentials;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', 401);
    }

    return this.generateTokenResponse(user);
  }

  generateTokenResponse(user) {
    const token = this.generateAuthToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    };
  }

  // Sign JWT and return
  generateAuthToken(id) {
    return jwt.sign({ id: id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  };
}

module.exports = new AuthService();