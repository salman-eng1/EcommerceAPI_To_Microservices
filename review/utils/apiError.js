class ApiError extends Error {
  constructor(message, statusCode) {
    super(message); //extend the constructor of the parent class
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true;
  }
}
module.exports = ApiError;
