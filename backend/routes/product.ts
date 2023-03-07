import express from "express";
const router = express.Router();

import {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} from "../controllers/productController";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth";

router.route("/products").get(getProducts);
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAdminProducts);
router.route("/product/:productId").get(getSingleProduct);

router
  .route("/admin/product")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);
router
  .route("/admin/product/:productId")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// Review Routes
router
  .route("/review/:productId")
  .put(isAuthenticatedUser, createProductReview);
router.route("/reviews/:id").get(isAuthenticatedUser, getProductReviews);
router.route("/reviews/:productId").delete(isAuthenticatedUser, deleteReview);

export default router;
