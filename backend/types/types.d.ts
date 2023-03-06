import mongoose from "mongoose";
import { Request } from "express";
import { Socket } from "socket.io";

export interface UserModel extends mongoose.Document {
  readonly _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  verified: boolean;
  role: string;
  resetPasswordToken: string | undefined;
  resetPasswordExpiresAt: Date | undefined;
  createdAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  getJwt: () => string;
  getResetPasswordToken: () => string;
}

export interface OrderModel extends mongoose.Document {
  readonly _id: mongoose.Types.ObjectId;
  shippingInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  user: mongoose.Types.ObjectId;
  orderItems: {
    name: string;
    quantity: number;
    image: string;
    price: number;
    productId: string;
  }[];
  paymentInfo: {
    id: string;
    status: string;
  };
  paidAt: Date;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus: "processing" | "Delivered" | "Shipped";
  deliveredAt: Date;
  createdAt: Date;
}

export interface ProductModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  description: string;
  ratings: number;
  images: {
    _id?: mongoose.Types.ObjectId;
    public_id: string;
    url: string;
  }[];
  category:
    | "Electronics"
    | "Cameras"
    | "Laptops"
    | "Accessories"
    | "Headphones"
    | "Food"
    | "Books"
    | "Clothes/Shoes"
    | "Beauty/Health"
    | "Sports"
    | "Outdoor"
    | "Home";
  seller: string;
  stock: number;
  numOfReviews: number;
  reviews: {
    _id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
  }[];
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}
