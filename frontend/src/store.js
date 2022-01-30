import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
	productsReducer,
	productDetailsReducer,
} from "./reducers/productReducers";
import { authReducer } from "./reducers/authReducers";
import { userReducer, forgotPasswordReducer } from "./reducers/userReducers";
import { cartReducers } from "./reducers/cartReducers";

const reducer = combineReducers({
	products: productsReducer,
	productDetails: productDetailsReducer,
	auth: authReducer,
	user: userReducer,
	forgotPassword: forgotPasswordReducer,
	cart: cartReducers,
});

let initialState = {
	cart: {
		cartItems: localStorage.getItem("cartItems")
			? JSON.parse(localStorage.getItem("cartItems"))
			: [],
	},
};

const middleware = [thunk];

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
