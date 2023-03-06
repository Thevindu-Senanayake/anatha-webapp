import { Router } from "express";
import {
  processPayment,
  sendStripeApi,
} from "../controllers/paymentController";
import { isAuthenticatedUser } from "../middleware/auth";

const router = Router();

router.route("/payment/process").post(processPayment);
router.route("/stripe-api").get(isAuthenticatedUser, sendStripeApi);

export default router;
