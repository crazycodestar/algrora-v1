import { LOG_IN, LOG_OUT, UPDATE_ACCOUNT_DATA } from "../actions/types";

const initialState = {};

if (localStorage.length) {
	console.log("working");
	initialState.token = JSON.parse(localStorage.getItem("token"));
	initialState.userData = JSON.parse(localStorage.getItem("userData"));
	console.log(initialState);
}

// {
// 	authenticationKey: "",
// 	firstname: "",
// 	lastname: "",
// 	username: "",
// 	emailAddress: "",
// 	storeId: 0,
// };

const accountReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOG_IN:
			return { ...state, ...action.data };
		case LOG_OUT:
			return {};
		case UPDATE_ACCOUNT_DATA:
			return { ...state, ...action.data };
		default:
			return state;
	}
};

export default accountReducer;
