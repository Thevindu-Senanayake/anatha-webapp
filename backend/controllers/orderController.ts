import { NextFunction, Request, Response } from "express";

import Order from "../models/order";
import Product from "../models/Product";

import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { OrderModel } from "../types/types";

// Create a new order	=> /api/v1/order/new
export const newOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderItems, shippingInfo, paymentInfo } = req.body;

    // Get items price
    let itemsPrice = 0;
    let shippingPrice = 0;
    orderItems.forEach(
      async (item: { quantity: number; productId: string }) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          return next(new ErrorHandler("Something went wrong!", 500));
        }
        itemsPrice = product.price * item.quantity;
        shippingPrice = product.shippingPrice;
      }
    );

    const order = await Order.create({
      orderItems,
      shippingInfo,
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
      return next(new ErrorHandler("no order found with this ID", 404));
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
