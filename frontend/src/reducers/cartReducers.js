import { ADD_TO_CART, CART_ITEM_REMOVE } from "../constants/cartConstants";

export const cartReducers = (state = { cartItems: [] }, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			const item = action.payload;

			const isItemExist = state.cartItems.find(
				(i) => i.product === item.product
			);

			if (isItemExist) {
				return {
					...state,
					cartItems: state.cartItems.map((i) =>
						i.product === isItemExist.product ? item : i
					),
				};
			} else {
				return {
					...state,
					cartItems: [...state.cartItems, item],
				};
			}

		case CART_ITEM_REMOVE:
			return {
				...state,
				cartItems: state.cartItems.filter(
					(i) => i.product !== action.payload
				),
			};
		default:
			return state;
	}
};
