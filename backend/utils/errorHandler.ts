import { Error as MongooseError } from "mongoose";

// error handler class
class ErrorHandler extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }

  static fromMongooseValidationError(error: MongooseError.ValidationError) {
    const fields = Object.keys(error.errors);
    const messages = fields.map((field) => `${field}`).join(", ");
    return new ErrorHandler(`Please enter your ${messages}`, 400);
  }
}

export default ErrorHandler;
