import axios from "axios";
import {
	UPDATE_PASSWORD_REQUEST,
	UPDATE_PASSWORD_SUCCESS,
	UPDATE_PASSWORD_FAIL,
	UPDATE_ACCOUNT_REQUEST,
	UPDATE_ACCOUNT_SUCCESS,
	UPDATE_ACCOUNT_RESET,
	UPDATE_ACCOUNT_FAIL,
} from "../constants/userConstants";

// Update Account Details
export const updateAccount = (userData) => async (dispatch) => {
	try {
		dispatch({ type: UPDATE_ACCOUNT_REQUEST });

		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};

		const { data } = await axios.put("/api/v1/me/update", userData, config);

		dispatch({
			type: UPDATE_ACCOUNT_SUCCESS,
			payload: data.success,
		});
	} catch (error) {
		dispatch({
			type: UPDATE_ACCOUNT_FAIL,
			payload: error.response.data.message,
		});
	}
};
