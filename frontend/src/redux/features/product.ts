import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types/reducerTypes";

interface AllProductsPayload {
  products: Product[];
  productCount: number;
  resPerPage: number;
  filteredProductCount: number;
}

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: true,
    error: "",
    success: false,
    products: [] as Product[],
    productCount: 0,
    resPerPage: 8,
    filteredProductCount: 0,
    reviews: [] as Product["reviews"],
  },
  reducers: {
    request: (state) => {
      state.loading = true;
      state.error = "";
      state.success = false;
      state.products = [];
      state.reviews = [];
    },
    getProducts: (state, action: PayloadAction<AllProductsPayload>) => {
      state.success = true;
      state.loading = false;
      state.error = "";
      state.products = action.payload.products;
      state.productCount = action.payload.productCount;
      state.resPerPage = action.payload.resPerPage;
      state.filteredProductCount = action.payload.filteredProductCount;
    },
    // for getting single product and creating new product & update existing
    getProduct: (state, action: PayloadAction<Product>) => {
      state.success = true;
      state.loading = false;
      state.error = "";
      state.products = [action.payload];
    },
    // for deleting product and creating review, deleting review
    mutate: (state) => {
      state.loading = false;
      state.success = true;
    },
    getReviews: (state, payload: PayloadAction<Product["reviews"]>) => {
      state.success = true;
      state.loading = false;
      state.reviews = payload.payload;
    },
    failure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.products = [];
    },
    clearErrors: (state) => {
      state.error = "";
    },
  },
});

export const { request, getProducts, getProduct, mutate, getReviews, failure } =
  productSlice.actions;
