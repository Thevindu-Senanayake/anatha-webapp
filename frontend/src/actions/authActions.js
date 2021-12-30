import axios from "axios";
import {
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	CLEAR_ERRORS,
} from "../constants/authConstants";

// Login
export const Login = (email, password) => async (dispatch) => {
	try {
		dispatch({ type: LOGIN_REQUEST });

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.post(
			"/api/v1/login",
			{ email, password },
			config
		);

		dispatch({
			type: LOGIN_SUCCESS,
			payload: data.user,
		});
	} catch (error) {
		dispatch({
			type: LOGIN_FAIL,
			payload: error.response.data.message,
		});
	}
};
