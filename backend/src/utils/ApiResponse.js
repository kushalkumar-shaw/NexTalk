class ApiResponse {
  constructor(statusCode, message, data) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }
}

module.exports = ApiResponse;
