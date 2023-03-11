import express from "express";
import {
  isAuthenticatedUser,
  authorizeRoles,
  isLoggedUser,
} from "../middleware/auth";

const router = express.Router();

import {
  getUserDetails,
  updateUserDetails,
  getAddress,
  deleteAddress,
  updateAddress,
  allUsers,
  getSingleUserDetails,
  updateUserDetailsByAdmin,
  deleteUser,
} from "../controllers/authController";

router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, updateUserDetails);

// Address
router
  .route("/address")
  .put(isAuthenticatedUser, updateAddress)
  .get(isAuthenticatedUser, getAddress)
  .delete(isAuthenticatedUser, deleteAddress);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserDetailsByAdmin)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;
