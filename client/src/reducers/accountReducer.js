import {
	LOG_IN,
	LOG_OUT,
	UPDATE_ACCOUNT_DATA,
	UPDATE_IMAGE,
} from "../actions/types";

const initialState = {};

if (localStorage.getItem("token")) {
	console.log("working");
	initialState.token = JSON.parse(localStorage.getItem("token"));
	console.log("token", localStorage.getItem("userData"));
	initialState.userData = JSON.parse(localStorage.getItem("userData"));
	console.log(initialState);
}

// {
// 	token: "",
// 	userData: {
// 		emailAddress: "",
// 		store: "",
// 		username: "",
// 	}
// }

const accountReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOG_IN:
			localStorage.setItem("token", JSON.stringify(action.data.token));
			localStorage.setItem("userData", JSON.stringify(action.data.userData));
			return { ...state, ...action.data };
		case LOG_OUT:
			localStorage.clear();
			return {};
		case UPDATE_ACCOUNT_DATA:
			const userData = { ...state.userData };
			for (const key in action.data) {
				// if key exists ^^^
				if (action.data[key]) {
					userData[key] = action.data[key];
				}
			}
			// const userData = { ...state.userData, store: action.data };
			localStorage.setItem("userData", JSON.stringify(userData));
			return { ...state, userData };
		case UPDATE_IMAGE:
			const newUserData = { ...state.userData, imageUri: action.data };
			return { ...state, userData: newUserData };
		default:
			return state;
	}
};

export default accountReducer;
