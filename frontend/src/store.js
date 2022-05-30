import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
	productsReducer,
	productDetailsReducer,
	newReviewReducer,
	newProductReducer,
	deleteProductReducer,
} from "./reducers/productReducers";
import { authReducer } from "./reducers/authReducers";
import { userReducer, forgotPasswordReducer } from "./reducers/userReducers";
import { cartReducers } from "./reducers/cartReducers";
import {
	newOrderReducer,
	myOrdersReducer,
	orderDetailsReducer,
	allOrdersReducer,
	updateOrderReducer,
} from "./reducers/orderReducers";

const reducer = combineReducers({
	products: productsReducer,
	productDetails: productDetailsReducer,
	newProduct: newProductReducer,
	auth: authReducer,
	user: userReducer,
	forgotPassword: forgotPasswordReducer,
	cart: cartReducers,
	newOrder: newOrderReducer,
	myOrders: myOrdersReducer,
	allOrders: allOrdersReducer,
	updateOrder: updateOrderReducer,
	orderDetails: orderDetailsReducer,
	newReview: newReviewReducer,
	deleteProduct: deleteProductReducer,
});

let initialState = {
	cart: {
		cartItems: localStorage.getItem("cartItems")
			? JSON.parse(localStorage.getItem("cartItems"))
			: [],
		shippingInfo: localStorage.getItem("shippingInfo")
			? JSON.parse(localStorage.getItem("shippingInfo"))
			: {},
	},
};

const middleware = [thunk];

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
