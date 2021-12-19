import axios from 'axios';

import {
	ALL_PRODUCTS_REQUEST,
	ALL_PRODUCTS_SUCCESS,
	ALL_PRODUCTS_FAIL,
	CLEAR_ERRORS

} from "../constants/productConstants";

export const getProducts = () => async (disptach) => {

	try {

		disptach({ type: ALL_PRODUCTS_REQUEST })

		const { data } = await axios.get("/api/v1/products")

		console.log(data)

		disptach({
			type: ALL_PRODUCTS_SUCCESS,
			payload: data
		})

	} catch (error) {
		disptach({
			type: ALL_PRODUCTS_FAIL,
			payload: error.response.data.message
		})

		console.log(error);
	}

}

// clear errors
export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS
	})
}
