import { Dispatch } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {
  request,
  success,
  logout,
  logoutFail,
  failure,
  forgotPassword as forgotPass,
  clearError,
} from "../features/auth";
import { APIBaseURI, axiosPostConfig, cookiesConfig } from "../types/const";

export const register =
  (name: string, email: string, password: string) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(request());

      const { data } = await axios.post(
        `${APIBaseURI}/register`,
        {
          password,
          email,
          name,
        },
        axiosPostConfig
      );

      dispatch(success(data.user));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(failure(error?.response?.data?.message));
      }
    }
  };

export const login =
  (email: string, password: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(request());

      const { data } = await axios.post(
        `${APIBaseURI}/login`,
        { email, password },
        axiosPostConfig
      );

      dispatch(success(data.user));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(failure(error?.response?.data?.message));
      }
    }
  };

export const logoutUser = () => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    await axios.get(`${APIBaseURI}/logout`, cookiesConfig);
    dispatch(logout());
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(logoutFail(error?.response?.data?.message));
    }
  }
};

export const forgotPassword = (email: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.post(
      `${APIBaseURI}/password/forgot`,
      { email },
      axiosPostConfig
    );

    dispatch(forgotPass(data.message));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const resetPassword =
  (token: string, password: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(request());

      const { data } = await axios.put(
        `${APIBaseURI}/password/reset/${token}`,
        { password },
        axiosPostConfig
      );
      dispatch(success(data.user));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(failure(error?.response?.data?.message));
      }
    }
  };

export const updatePassword =
  (newPassword: string, oldPassword: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(request());

      const { data } = await axios.put(`${APIBaseURI}/password/update`);
      dispatch(success(data.user));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(failure(error?.response?.data?.message));
      }
    }
  };

// clear errors
export const clearErrors = () => async (dispatch: Dispatch) => {
  dispatch(clearError());
};
