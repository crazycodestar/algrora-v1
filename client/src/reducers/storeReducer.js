import {
	ADD_STORE_PRODUCT,
	CREATE_STORE,
	REMOVE_STORE_PRODUCT,
	UPDATE_STORE,
} from "../actions/types";

const initialState = {
	storeProducts: [],
	createStoreData: {},
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
		case CREATE_STORE:
			console.log("store reducer");
			console.log(action.data);
			return { ...state, createStoreData: { ...action.data } };
		default:
			return state;
	}
};

export default storeReducer;
