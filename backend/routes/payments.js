const express = require("express");
const router = express.Router();

const { processPayment } = require("../controllers/paymentController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);

module.exports = router;
