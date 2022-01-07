import {
	UPDATE_PASSWORD_REQUEST,
	UPDATE_PASSWORD_SUCCESS,
	UPDATE_PASSWORD_FAIL,
	UPDATE_ACCOUNT_REQUEST,
	UPDATE_ACCOUNT_SUCCESS,
	UPDATE_ACCOUNT_RESET,
	UPDATE_ACCOUNT_FAIL,
} from "../constants/userConstants";

export const userReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_ACCOUNT_REQUEST:
			return {
				...state,
				loading: true,
			};

		case UPDATE_ACCOUNT_SUCCESS:
			return {
				...state,
				loading: false,
				isUpdated: action.payload,
			};

		case UPDATE_ACCOUNT_RESET:
			return {
				...state,
				isUpdated: false,
			};

		case UPDATE_ACCOUNT_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};

		default:
			return state;
	}
};
