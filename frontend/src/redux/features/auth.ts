import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/reducerTypes";

const authReducer = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    loading: true,
    error: "",
    user: {} as User,
    message: "",
  },
  reducers: {
    request: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    success: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    forgotPassword: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.message = action.payload;
    },
    logout: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {} as User;
    },
    logoutFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = action.payload;
    },
    failure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.user = {} as User;
    },
    clearError: (state) => {
      state.error = "";
    },
  },
});

export const {
  request,
  success,
  logout,
  forgotPassword,
  logoutFail,
  failure,
  clearError,
} = authReducer.actions;

export default authReducer.reducer;
