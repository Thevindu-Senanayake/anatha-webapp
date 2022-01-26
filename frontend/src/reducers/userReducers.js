import {
	UPDATE_PASSWORD_REQUEST,
	UPDATE_PASSWORD_SUCCESS,
	UPDATE_PASSWORD_RESET,
	UPDATE_PASSWORD_FAIL,
	FORGOT_PASSWORD_REQUEST,
	FORGOT_PASSWORD_SUCCESS,
	FORGOT_PASSWORD_FAIL,
	RESET_PASSWORD_REQUEST,
	RESET_PASSWORD_SUCCESS,
	RESET_PASSWORD_FAIL,
	UPDATE_ACCOUNT_REQUEST,
	UPDATE_ACCOUNT_SUCCESS,
	UPDATE_ACCOUNT_RESET,
	UPDATE_ACCOUNT_FAIL,
} from "../constants/authConstants";

export const userReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_ACCOUNT_REQUEST:
		case UPDATE_PASSWORD_REQUEST:
			return {
				...state,
				loading: true,
			};

		case UPDATE_ACCOUNT_SUCCESS:
		case UPDATE_PASSWORD_SUCCESS:
			return {
				...state,
				loading: false,
				isUpdated: action.payload,
			};

		case UPDATE_ACCOUNT_RESET:
		case UPDATE_PASSWORD_RESET:
			return {
				...state,
				isUpdated: false,
			};

		case UPDATE_ACCOUNT_FAIL:
		case UPDATE_PASSWORD_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};

		default:
			return state;
	}
};

// forgot password reducer
export const forgotPasswordReducer = (state = {}, action) => {
	switch (action.type) {
		case FORGOT_PASSWORD_REQUEST:
		case RESET_PASSWORD_REQUEST:
			return {
				...state,
				loading: true,
				error: null,
			};

		case FORGOT_PASSWORD_SUCCESS:
			return {
				...state,
				loading: false,
				message: action.payload,
			};

		case RESET_PASSWORD_SUCCESS:
			return {
				...state,
				success: action.payload,
			};

		case FORGOT_PASSWORD_FAIL:
		case RESET_PASSWORD_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};

		default:
			return state;
	}
};
