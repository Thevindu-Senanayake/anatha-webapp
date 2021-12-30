import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
	productsReducer,
	productDetailsReducer,
} from "./reducers/productReducers";
import { authReducer } from "./reducers/authReducers";

const reducer = combineReducers({
	products: productsReducer,
	productDetails: productDetailsReducer,
	auth: authReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
