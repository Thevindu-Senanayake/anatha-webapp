import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import ErrorHandler from "../utils/errorHandler";

const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      errorStatusCode: err.statusCode,
      errorName: err.name,
      errorMessage: err.message,
      Stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };

    error.message = err.message;

    // Wrong Mongoose Object ID Error
    if (err instanceof Error.CastError) {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose Validation Error
    if (err instanceof Error.ValidationError) {
      error = ErrorHandler.fromMongooseValidationError(err);
    }

    // Handling wrong JSON Web Token
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web Token is invalid. Try Again!!!";
      error = new ErrorHandler(message, 400);
    }

    // Handling Expired JSON Web Token
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web Token is expired";
      error = new ErrorHandler(message, 400);
    }

    // Handling Expired JSON Web Token
    if (err.statusCode === 429) {
      const message = "You have already submitted the attendance for today";
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export default errorMiddleware;
