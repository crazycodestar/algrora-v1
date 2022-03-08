import {
	ADD_STORE_PRODUCT,
	REMOVE_STORE_PRODUCT,
	UPDATE_STORE,
} from "../actions/types";

const initialState = {
	storeProducts: [],
};

const storeReducer = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_STORE:
			console.log("i am updating store product");
			return {
				...state,
				storeProducts: action.data,
			};
		case ADD_STORE_PRODUCT:
			return {
				...state,
				storeProducts: state.storeProducts.concat(action.data),
			};
		case REMOVE_STORE_PRODUCT:
			return {
				...state,
				storeProducts: state.storeProducts.filter(
					(product) => product !== action.key
				),
			};
		default:
			return state;
	}
};

export default storeReducer;
