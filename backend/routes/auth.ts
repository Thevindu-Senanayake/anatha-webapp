import express from "express";
import { isAuthenticatedUser, isLoggedUser } from "../middleware/auth";

const router = express.Router();

import {
  registerUser,
  resendOTP,
  verifyRegistration,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  logoutUser,
} from "../controllers/authController";

router.route("/register").post(isLoggedUser, registerUser);
router.route("/register/verify").get(isLoggedUser, verifyRegistration);
router.route("/resendOTP").get(isLoggedUser, resendOTP);
router.route("/login").post(isLoggedUser, loginUser);

router.route("/password/forgot").post(isLoggedUser, forgotPassword);
router.route("/password/reset/:token").put(isLoggedUser, resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/logout").get(isAuthenticatedUser, logoutUser);

export default router;
