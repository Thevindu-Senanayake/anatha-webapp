import { NextFunction, Request, Response } from "express";

// Export a higher-order function
export default (func: Function) => {
  // Return a new function that takes in three arguments: req, res, and next
  return (req: Request, res: Response, next: NextFunction) => {
    // Resolve the result of running func with req, res, and next as arguments
    Promise.resolve(func(req, res, next))
      // If func throws an error, call the next function to pass the error to the next middleware in the chain
      .catch((err) => {
        console.log(err);
        next(err);
      });
  };
};
