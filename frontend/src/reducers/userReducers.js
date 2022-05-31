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
	ALL_USERS_REQUEST,
	ALL_USERS_SUCCESS,
	ALL_USERS_FAIL,
	USER_DETAILS_REQUEST,
	USER_DETAILS_SUCCESS,
	USER_DETAILS_FAIL,
	UPDATE_USER_REQUEST,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_RESET,
	UPDATE_USER_FAIL,
	DELETE_USER_REQUEST,
	DELETE_USER_SUCCESS,
	DELETE_USER_RESET,
	DELETE_USER_FAIL,
} from "../constants/authConstants";

export const userReducer = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_ACCOUNT_REQUEST:
		case UPDATE_PASSWORD_REQUEST:
		case UPDATE_USER_REQUEST:
		case DELETE_USER_REQUEST:
			return {
				...state,
				loading: true,
			};

		case UPDATE_ACCOUNT_SUCCESS:
		case UPDATE_PASSWORD_SUCCESS:
		case UPDATE_USER_SUCCESS:
			return {
				...state,
				loading: false,
				isUpdated: action.payload,
			};

		case DELETE_USER_SUCCESS:
			return {
				...state,
				loading: false,
				isDeleted: action.payload,
			};

		case UPDATE_ACCOUNT_RESET:
		case UPDATE_PASSWORD_RESET:
		case UPDATE_USER_RESET:
			return {
				...state,
				isUpdated: false,
			};

		case DELETE_USER_RESET:
			return {
				...state,
				isDeleted: false,
			};

		case UPDATE_ACCOUNT_FAIL:
		case UPDATE_PASSWORD_FAIL:
		case UPDATE_USER_FAIL:
		case DELETE_USER_FAIL:
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

export const allUsersReducer = (state = { users: [] }, action) => {
	switch (action.type) {
		case ALL_USERS_REQUEST:
			return {
				...state,
				loading: true,
				error: null,
			};

		case ALL_USERS_SUCCESS:
			return {
				...state,
				loading: false,
				users: action.payload,
			};

		case ALL_USERS_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};

		default:
			return state;
	}
};

export const userDetailsReducer = (state = { user: {} }, action) => {
	switch (action.type) {
		case USER_DETAILS_REQUEST:
			return {
				...state,
				loading: true,
				error: null,
			};

		case USER_DETAILS_SUCCESS:
			return {
				...state,
				loading: false,
				user: action.payload,
			};

		case USER_DETAILS_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};

		default:
			return state;
	}
};
