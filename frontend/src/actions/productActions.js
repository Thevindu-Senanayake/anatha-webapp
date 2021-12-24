import axios from "axios";

import {
	ALL_PRODUCTS_REQUEST,
	ALL_PRODUCTS_SUCCESS,
	ALL_PRODUCTS_FAIL,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS,
	PRODUCT_DETAILS_FAIL,
	CLEAR_ERRORS,
} from "../constants/productConstants";

export const getProducts = () => async (disptach) => {
	try {
		disptach({ type: ALL_PRODUCTS_REQUEST });

		const { data } = await axios.get("/api/v1/products");

		disptach({
			type: ALL_PRODUCTS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		disptach({
			type: ALL_PRODUCTS_FAIL,
			payload: error.response.data.message,
		});

		console.log(error);
	}
};

export const getProductDetails = (id) => async (disptach) => {
	try {
		disptach({ type: PRODUCT_DETAILS_REQUEST });

		const { data } = await axios.get(`/api/v1/product/${id}`);

		disptach({
			type: PRODUCT_DETAILS_SUCCESS,
			payload: data.product,
		});
	} catch (error) {
		disptach({
			type: PRODUCT_DETAILS_FAIL,
			payload: error.response.data.message,
		});

		console.log(error);
	}
};

// clear errors
export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
};
