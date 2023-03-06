import { Dispatch } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {
  request,
  getProducts as getProductsAction,
  getProduct as getProductAction,
  mutate,
  getReviews as getReviewsAction,
  failure,
} from "../features/product";
import { APIBaseURI, axiosPostConfig, cookiesConfig } from "../types/const";

export const getProducts = () => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.get(`${APIBaseURI}/products`, cookiesConfig);

    dispatch(getProductsAction(data));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const getProductsByAdmin = () => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.get(
      `${APIBaseURI}/admin/products`,
      cookiesConfig
    );

    dispatch(getProductsAction(data.products));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const getProduct = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(request());

    const { data } = await axios.get(
      `${APIBaseURI}/product/${id}`,
      cookiesConfig
    );

    dispatch(getProductAction(data.product));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const createProduct =
  (
    name: string,
    price: number,
    description: string,
    category: string,
    stock: number,
    seller: string,
    images: string | string[]
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(request());

      const { data } = await axios.post(
        `${APIBaseURI}/admin/product`,
        {
          name,
          price,
          description,
          category,
          stock,
          seller,
          images,
        },
        axiosPostConfig
      );

      dispatch(getProductAction(data.product));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(failure(error?.response?.data?.message));
      }
    }
  };

export const updateProduct =
  (
    id: string,
    images: string | string[],
    name: string,
    price: number,
    description: string,
    category: string,
    stock: number,
    seller: string
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(request());
      const { data } = await axios.put(
        `${APIBaseURI}/admin/product/${id}`,
        {
          name,
          price,
          description,
          category,
          stock,
          seller,
          images,
        },
        axiosPostConfig
      );

      dispatch(getProductAction(data.product));
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(failure(error?.response?.data?.message));
      }
    }
  };

export const deleteProduct = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(request());
    const { data } = await axios.delete(
      `${APIBaseURI}/admin/product/${id}`,
      cookiesConfig
    );

    dispatch(mutate());
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

// Reviews
export const createReview =
  (id: string, rating: number, comment: string) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(request());
      const { data } = await axios.put(
        `${APIBaseURI}/review/${id}`,
        {
          rating,
          comment,
        },
        axiosPostConfig
      );

      dispatch(mutate());
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(failure(error?.response?.data?.message));
      }
    }
  };

export const getReviews = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(request());
    const { data } = await axios.get(
      `${APIBaseURI}/reviews/${id}`,
      cookiesConfig
    );

    dispatch(getReviewsAction(data.reviews));
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};

export const deleteReviews = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(request());
    const { data } = await axios.delete(
      `${APIBaseURI}/reviews/${id}`,
      cookiesConfig
    );

    dispatch(mutate());
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(failure(error?.response?.data?.message));
    }
  }
};
