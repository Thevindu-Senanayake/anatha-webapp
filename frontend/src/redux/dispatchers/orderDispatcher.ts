import { Dispatch } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {
  request,
  success,
  deleteSuccess,
  clearError,
  failure,
} from "../features/orders";
import { APIBaseURI, axiosPostConfig, cookiesConfig } from "../types/const";
import { Order } from "../types/reducerTypes";

export const createOrder =
  (
    orderItems: Order["orderItems"],
    shippingInfo: Order["shippingInfo"],
    paymentInfo: Order["paymentInfo"],
    itemsPrice: number,
    shippingPrice: number,
    totalPrice: number
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(request());

      const { data } = await axios.post(
        `${APIBaseURI}/order`,
        {
          orderItems,
          shippingInfo,
          paymentInfo,
          itemsPrice,
          shippingPrice,
          totalPrice,
        },
        axiosPostConfig
      );

      dispatch(success(data.order));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(failure(error?.response?.data?.message));
      }
    }
  };

export const getOrder = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.get(
      `${APIBaseURI}/order/${id}`,

      cookiesConfig
    );

    dispatch(success(data.user));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const getMyOrders = () => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.get(`${APIBaseURI}/orders/me`, cookiesConfig);
    dispatch(success(data.orders));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const getAllOrders = () => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.get(
      `${APIBaseURI}/admin/orders`,
      cookiesConfig
    );

    dispatch(success(data.orders));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const updateOrder =
  (id: string, status: "processed" | "delivered" | "shipped") =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(request());

      const { data } = await axios.put(
        `${APIBaseURI}/admin/order/${id}`,
        { status },
        axiosPostConfig
      );
      dispatch(success(data.user));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(failure(error?.response?.data?.message));
      }
    }
  };

export const deleteOrder = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    await axios.delete(`${APIBaseURI}/admin/order/${id}`);
    dispatch(deleteSuccess());
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const clearErrors = () => async (dispatch: Dispatch) => {
  dispatch(clearError());
};
