import {
	ADD_CART_PRODUCT,
	INCREMENT_CART_PRODUCT,
	DECREMENT_CART_PROCUCT,
	REMOVE_CART_PRODUCT,
	CLEAR_CART,
} from "../actions/types";

const initialState = {
	cartProducts: [],
};

const cartReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_CART_PRODUCT:
			return {
				...state,
				cartProducts: state.cartProducts.concat(action.data),
			};
		case INCREMENT_CART_PRODUCT:
			let newCartProduct = [...state.cartProducts];
			let index = newCartProduct.findIndex(
				(product) => product.id === action.data.id
			);
			newCartProduct[index] = {
				...action.data,
				quantity: state.cartProducts[index].quantity,
			};
			newCartProduct[index].quantity++;
			return {
				...state,
				cartProducts: newCartProduct,
			};
		case DECREMENT_CART_PROCUCT:
			let decrementingCartProducts = [...state.cartProducts];
			let position = decrementingCartProducts.findIndex(
				(product) => product.id === action.data.id
			);
			decrementingCartProducts[position] = {
				...action.data,
				quantity: state.cartProducts[position].quantity,
			};
			decrementingCartProducts[position].quantity--;
			return {
				...state,
				cartProducts: decrementingCartProducts,
			};
		case REMOVE_CART_PRODUCT:
			return {
				...state,
				cartProducts: state.cartProducts.filter(
					(product) => action.key !== product.id
				),
			};
		case CLEAR_CART:
			return { cartProducts: [] };
		default:
			return state;
	}
};

export default cartReducer;
