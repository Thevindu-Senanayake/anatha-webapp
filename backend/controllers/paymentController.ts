import { Request, Response, NextFunction } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import stripe from "stripe";

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

// Process stripe payments => /api/v1/payment/process
export const processPayment = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  }
);

// Send stripe API Key => /api/v1/stripe-api
export const sendStripeApi = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      stripeApiKey: process.env.STRIPE_API_KEY,
    });
  }
);
