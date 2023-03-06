import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/reducerTypes";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: true,
    error: "",
    users: [] as User[],
    success: false,
    me: {} as User,
  },
  reducers: {
    request: (state) => {
      state.loading = true;
      state.error = "";
      state.success = false;
      state.users = [] as User[];
    },
    loadUser: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.success = true;
      state.me = action.payload;
    },
    success: (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.success = true;
      state.users = action.payload;
    },
    adminSuccess: (state, action: PayloadAction<boolean>) => {
      state.loading = false;
      state.success = action.payload;
    },
    failure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = "";
    },
  },
});

export const {
  request,
  loadUser,
  success,
  adminSuccess,
  clearError,
  failure,
} = userSlice.actions;

export default userSlice.reducer;
