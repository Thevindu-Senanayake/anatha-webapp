import { Dispatch } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {
  request,
  loadUser as loadMe,
  success,
  adminSuccess,
  failure,
  clearError,
} from "../features/user";
import { APIBaseURI, axiosPostConfig, cookiesConfig } from "../types/const";

export const loadUser = () => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.get(`${APIBaseURI}/me`, cookiesConfig);
    dispatch(loadMe(data.user));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const updateUser =
  (name: string, email: string, avatar: string) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(request());

      const { data } = await axios.put(
        `${APIBaseURI}/me/update`,
        { name, email, avatar },
        axiosPostConfig
      );

      dispatch(loadMe(data.user));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(failure(error?.response?.data?.message));
      }
    }
  };

export const getUsers = () => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.get(
      `${APIBaseURI}/admin/users`,
      cookiesConfig
    );

    dispatch(success(data.users));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const deleteUser = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.delete(
      `${APIBaseURI}/admin/user/${id}`,
      cookiesConfig
    );

    dispatch(adminSuccess(data.success));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const getUser = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.get(
      `${APIBaseURI}/admin/user/${id}`,
      cookiesConfig
    );

    dispatch(success(data.user));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const updateUserByAdmin =
  (id: string, name: string, email: string, role: string) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(request());

      const { data } = await axios.put(
        `${APIBaseURI}/admin/user/${id}`,
        {
          name,
          email,
          role,
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

// clear errors
export const clearErrors = () => async (dispatch: Dispatch) => {
  dispatch(clearError());
};
