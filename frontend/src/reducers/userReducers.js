import {
	UPDATE_PASSWORD_REQUEST,
	UPDATE_PASSWORD_SUCCESS,
	UPDATE_PASSWORD_RESET,
	UPDATE_PASSWORD_FAIL,
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
