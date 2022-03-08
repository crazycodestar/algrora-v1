import {
	ADD_CART_PRODUCT,
	INCREMENT_CART_PRODUCT,
	DECREMENT_CART_PROCUCT,
	REMOVE_CART_PRODUCT,
	CLEAR_CART,
} from "./types";

export const addCartProduct = (product) => ({
	type: ADD_CART_PRODUCT,
	data: product,
});

export const incrementCartProduct = (product) => ({
	type: INCREMENT_CART_PRODUCT,
	data: product,
});

export const decrementCartProduct = (product) => ({
	type: DECREMENT_CART_PROCUCT,
	data: product,
});

export const removeCartProduct = (key) => ({
	type: REMOVE_CART_PRODUCT,
	key,
});

export const clearCart = () => ({
	type: CLEAR_CART,
});
