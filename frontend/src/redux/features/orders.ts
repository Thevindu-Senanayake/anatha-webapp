import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../types/reducerTypes";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: true,
    error: "",
    success: false,
    orders: [] as Order[] | Order,
  },
  reducers: {
    request: (state) => {
      state.loading = true;
      state.error = "";
      state.success = false;
      state.orders = [] as Order[];
    },
    success: (state, action: PayloadAction<Order[] | Order>) => {
      state.success = true;
      state.loading = false;
      state.error = "";
      state.orders = action.payload;
    },
    deleteSuccess: (state) => {
      state.success = true;
      state.loading = false;
      state.error = "";
    },
    failure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    clearError: (state) => {
      state.error = "";
    },
  },
});

export const { request, success, deleteSuccess, clearError, failure } =
  orderSlice.actions;
