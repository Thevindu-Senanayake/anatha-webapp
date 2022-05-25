import axios from "axios";

import {
	CREATE_ORDER_REQUEST,
	CREATE_ORDER_SUCCESS,
	CREATE_ORDER_FAIL,
	MY_ORDERS_REQUEST,
	MY_ORDERS_SUCCESS,
	MY_ORDERS_FAIL,
	ORDER_DETAILS_REQUEST,
	ORDER_DETAILS_SUCCESS,
	ORDER_DETAILS_FAIL,
	CLEAR_ERRORS,
} from "../constants/orderConstants";

export const createOrder = (order) => async (dispatch, getState) => {
	try {
		dispatch({ type: CREATE_ORDER_REQUEST });

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.post("/api/v1/order/new", order, config);

		dispatch({
			type: CREATE_ORDER_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CREATE_ORDER_FAIL,
			payload: error.response.data.message,
		});
	}
};

// Get currently logged in user's orders
export const myOrders = () => async (dispatch) => {
	try {
		dispatch({ type: MY_ORDERS_REQUEST });

		const { data } = await axios.get("/api/v1/orders/me");

		dispatch({
			type: MY_ORDERS_SUCCESS,
			payload: data.orders,
		});
	} catch (error) {
		dispatch({
			type: MY_ORDERS_FAIL,
			payload: error.response.data.message,
		});
	}
};

// Get specific order details
export const getOrderDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: ORDER_DETAILS_REQUEST });

		const { data } = await axios.get(`/api/v1/order/${id}`);

		console.log(data);
		console.log(data.order);

		dispatch({
			type: ORDER_DETAILS_SUCCESS,
			payload: data.order,
		});
		console.log(data.order);
	} catch (error) {
		console.log(error);
		dispatch({
			type: ORDER_DETAILS_FAIL,
			payload: error.response.data.message,
		});
	}
};

// clear errors
export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
};
