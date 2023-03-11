import { NextFunction, Request, Response } from "express";

import Order from "../models/order";
import Product from "../models/Product";

import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { OrderModel, UserModel } from "../types/types";

// Create a new order	=> /api/v1/order/new
export const newOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderItems, shippingInfo, paymentInfo } = req.body;

    let shippingDetails: UserModel["address"];

    // Get Default Shipping Address If Address not provided & If Address provided then validate it
    if (!shippingInfo) {
      if (!req.body.user.address) {
        return next(
          new ErrorHandler(
            "You Don't have any Default address information! Please Provide a shipping address",
            400
          )
        );
      }
      shippingDetails = req.body.user.address;
    } else {
      const {
        fullName,
        phoneNumber,
        fullAddress,
        postalCode,
        city,
        country,
        tag,
      } = shippingInfo;

      if (
        !fullName ||
        !phoneNumber ||
        !fullAddress ||
        !postalCode ||
        !city ||
        !country ||
        !tag
      ) {
        return next(
          new ErrorHandler("All fields of Address are required", 400)
        );
      }

      shippingDetails = shippingInfo;
    }

    // Get items price
    // Additionally Ordered Products are Validating
    let itemsPrice = 0;
    let shippingPrice = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return next(
          new ErrorHandler(`Product Not Found with Id: ${item.productId}`, 400)
        );
      }
      // Check if Product out of stock
      if (product.stock === 0) {
        return next(
          new ErrorHandler(`Product ${product._id} is out of stock`, 400)
        );
      }
      if (product.stock < item.quantity) {
        // Check if user trying to Purchase a product more than stock available
        return next(
          new ErrorHandler(
            `Product ${item.productId} only has ${product.stock} stock available`,
            400
          )
        );
      }
      itemsPrice = product.price * item.quantity;
      shippingPrice = product.shippingPrice;
    }

    const order = await Order.create({
      orderItems,
      shippingInfo: shippingDetails,
      itemsPrice,
      shippingPrice,
      totalPrice: itemsPrice + shippingPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.body.user._id,
    });

    res.status(200).json({
      success: true,
      order,
    });
  }
);

// Get single order	=> /api/v1/order/:id
export const getSingleOrderDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return next(
        new ErrorHandler(`Order Not Found with Id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      order,
    });
  }
);

// Get logged in user's all orders	=> /api/v1/orders/me
export const myOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find({ user: req.body.user._id });

    res.status(200).json({
      success: true,
      orders,
    });
  }
);

// Admin Routes
// Get all orders	=> /api/v1/admin/orders
export const allOrders = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      orderCount: orders.length,
      totalAmount,
      orders,
    });
  }
);

// Update order status	=> /api/v1/admin/order/:id
export const updateOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id);

    if (!order)
      return next(
        new ErrorHandler(`Order Not Found with Id: ${req.params.id}`, 404)
      );

    if (order.orderStatus === "Delivered") {
      return next(
        new ErrorHandler("You Have Already Delivered this Order", 400)
      );
    }

    order.orderItems.forEach(async (item) => {
      await updateStock(item.productId, item.quantity, next);
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  }
);

const updateStock = async (
  id: string,
  quantity: number,
  next: NextFunction
) => {
  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler(`Product Not Found with Id: ${id}`, 404));
  }

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
};

// Delete order	=> /api/v1/admin/order/:id
export const deleteOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorHandler(`Order Not Found with Id: ${req.params.id}`, 404)
      );
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
    });
  }
);
