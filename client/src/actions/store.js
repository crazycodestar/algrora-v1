import { ADD_STORE_PRODUCT, REMOVE_STORE_PRODUCT, UPDATE_STORE } from "./types";

export const updateStore = (data) => ({
	type: UPDATE_STORE,
	data,
});

export const addStoreProduct = (product) => ({
	type: ADD_STORE_PRODUCT,
	data: product,
});

export const removeProductStore = (key) => ({
	type: REMOVE_STORE_PRODUCT,
	key,
});
