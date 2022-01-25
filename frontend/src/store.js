import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
	productsReducer,
	productDetailsReducer,
} from "./reducers/productReducers";
import { authReducer } from "./reducers/authReducers";
import { userReducer, forgotPasswordReducer } from "./reducers/userReducers";

const reducer = combineReducers({
	products: productsReducer,
	productDetails: productDetailsReducer,
	auth: authReducer,
	user: userReducer,
	forgotPassword: forgotPasswordReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
