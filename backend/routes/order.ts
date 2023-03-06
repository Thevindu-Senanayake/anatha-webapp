import express from "express";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth";
const router = express.Router();

import {
  newOrder,
  getSingleOrderDetails,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";

router.route("/order").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrderDetails);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default router;
