import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

import {
  OrderModel,
  ProductModel,
  ReviewInput,
  UserModel,
} from "../types/types";
import Product from "../models/Product";
import Order from "../models/order";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import APIFeatures, { QueryString } from "../utils/apiFeatures";

// Create new product  => /api/v1/admin/product/new
export const newProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, description, category, stock, shippingPrice } =
      req.body;

    // Validate inputs
    if (!name || !description || !category) {
      return next(
        new ErrorHandler("All Product Details must be provided", 400)
      );
    }

    // Check for 0 price & 0 stock
    if (price === 0) {
      return next(new ErrorHandler("Product Price Can't Be 0", 400));
    }
    if (stock === 0) {
      return next(new ErrorHandler("Product Stock Can't Be 0", 400));
    }

    // Assign each image to local variable
    let images: string[] = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    // Upload images to cloud storage
    if (!Array.isArray(images)) {
      return next(new ErrorHandler("Images should be in array format", 400));
    }

    let imagesLinks: ProductModel["images"] = [];

    for (let i = 0; i < images.length && i > 10; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const productData = {
      images: imagesLinks,
      seller: req.body.user._id,
      name,
      price,
      description,
      category,
      stock,
      shippingPrice,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product,
    });
  }
);

// Get All products  => /api/v1/products?keyword=apple
export const getProducts = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const resPerPage = 8;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(
      Product.find(),
      req.query as QueryString
    )
      .search()
      .filter();

    let products = await apiFeatures.query;
    let filteredProductCount = products.length;

    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query.clone();

    setTimeout(() => {
      res.status(200).json({
        success: true,
        productCount,
        resPerPage,
        filteredProductCount,
        products,
      });
    }, 2000);
  }
);

// Get All products (Admin)  => /api/v1/admin/products
export const getAdminProducts = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  }
);

// get Single product details => /api/v1/product/:productId
export const getSingleProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  }
);

// Update Product  => /api/v1/admin/product/:productId
export const updateProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, description, category, stock, shippingPrice } =
      req.body;

    let product = await Product.findById(req.params.productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    let images: string[] = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    let imagesLinks: ProductModel["images"] = [];

    if (images !== undefined) {
      // Check in images are not in array format
      if (!Array.isArray(images)) {
        return next(new ErrorHandler("Images should be in array format", 400));
      }

      // Deleting images associated with the product
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }

      for (let i = 0; i < images.length && i > 10; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.images = imagesLinks;
    }

    const productData = {
      images: imagesLinks,
      name,
      price,
      description,
      category,
      stock,
      shippingPrice,
    };

    product = await Product.findByIdAndUpdate(
      req.params.productId,
      productData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      product,
    });
  }
);

// Delete Product  => /api/v1/admin/product/:productId
export const deleteProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product is deleted",
    });
  }
);

// Review Functions
// Create new review		=> /api/v1/review
export const createProductReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rating, comment }: ReviewInput = req.body;
    const { productId } = req.params;

    // Validate user inputs
    if (
      !rating ||
      !comment ||
      typeof rating !== "number" ||
      typeof comment !== "string"
    ) {
      return next(
        new ErrorHandler(
          "Rating and comment are required and must be a number and string respectively",
          400
        )
      );
    }

    // Check if Requested User Have Purchase the Product
    const orders: OrderModel[] = await Order.find({
      user: req.body.user._id,
      orderStatus: "Delivered",
    });

    const purchasedOrder: OrderModel | undefined = orders.find((order) =>
      order.orderItems.some((item) => item.productId.toString() === productId)
    );

    if (!purchasedOrder) {
      return next(
        new ErrorHandler(
          "Please Purchase This Product first to add Review",
          400
        )
      );
    }

    const review = {
      user: req.body.user._id as mongoose.Types.ObjectId,
      name: req.body.user.name as string,
      rating: rating,
      comment: comment,
    };

    const product: ProductModel | null = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // If User Already Added a Review then get the Index of that review object
    const userReviewIndex = product.reviews.findIndex(
      // deepcode ignore HTTPSourceWithUncheckedType: <please specify a reason of ignoring this>
      (r) => r.user.toString() === req.body.user._id.toString()
    );

    if (userReviewIndex !== -1) {
      product.reviews[userReviewIndex].comment = comment;
      product.reviews[userReviewIndex].rating = rating;
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // Rating Calculation
    const sumOfRatings = product.reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0);

    const productRating = sumOfRatings / product.reviews.length;
    product.rating = parseFloat(productRating.toFixed(1));

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  }
);

// Get All Reviews of a Product	=> /api/v1/reviews
export const getProductReviews = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  }
);

// Delete a Review	=> /api/v1/reviews
export const deleteReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    if (!req.query.id) {
      return next(new ErrorHandler("Review Id is specified", 400));
    }

    // Find the index of the review to delete
    const reviewIndex = product.reviews.findIndex(
      (review) => review._id?.toString() === req.query.id
    );

    if (reviewIndex !== -1) {
      return next(
        new ErrorHandler(`Review not found with Id: ${req.query.id}`, 404)
      );
    }

    // If the review exists, remove it
    product.reviews.splice(reviewIndex, 1);
    product.numOfReviews = product.reviews.length;
    await product.save();
    res.status(200).json({ success: true, product });
  }
);
