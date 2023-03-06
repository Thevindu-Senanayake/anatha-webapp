export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: {
    public_id: string;
    url: string;
  };
  verified: boolean;
  role: "user" | "admin";
  createdAt: Date;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  ratings: number;
  images: {
    _id: string;
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
    _id: string;
    user: string;
    name: string;
    rating: number;
    comment: string;
  }[];
  addedBy: string;
  createdAt: Date;
}

export interface Order {
  _id: string;
  shippingInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  user: string;
  orderItems: {
    name: string;
    quantity: number;
    images: string;
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
  orderStatus: "processing" | "shipped" | "delivered";
  deliveredAt: Date;
  createdAt: Date;
}
