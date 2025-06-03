/**
 * Standard API response structure
 */
class ApiResponse {
  constructor(success, message, data = null, statusCode = 200) {
    this.success = success;
    this.message = message;
    if (data !== null) {
      this.data = data;
    }
    this.statusCode = statusCode;
  }

  static success(data = null, message = 'Operation successful', statusCode = 200) {
    return new ApiResponse(true, message, data, statusCode);
  }

  static error(message = 'Operation failed', statusCode = 400) {
    return new ApiResponse(false, message, null, statusCode);
  }

  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

module.exports = ApiResponse;