import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";

import { ProductModel, UserModel } from "../types/types";
import Product from "../models/Product";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import APIFeatures, { QueryString } from "../utils/apiFeatures";
import mongoose from "mongoose";

// Create new product  => /api/v1/admin/product/new
export const newProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, description, category, stock, seller } = req.body;

    let images: string[] = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    let imagesLinks: ProductModel["images"] = [];

    for (let i = 0; i < images.length; i++) {
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
      addedBy: req.body.user._id,
      name,
      price,
      description,
      category,
      stock,
      seller,
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
    const { name, price, description, category, stock, seller } = req.body;

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
      // Deleting images associated with the product
      for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.images[i].public_id
        );
      }

      for (let i = 0; i < images.length; i++) {
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
      seller,
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
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
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
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const review = {
      user: req.body.user._id as mongoose.Types.ObjectId,
      name: req.body.user.name as string,
      rating: Number(rating),
      comment: comment as string,
    };

    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product.reviews.find(
      (r) => r.user.toString() === req.body.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.body.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

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

    const reviews = product.reviews.filter(
      (review) => review._id?.toString() !== req.query.id?.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(
      req.params.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        validateBeforeSave: false,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  }
);
