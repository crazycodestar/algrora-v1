import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import cartReducer from "./cartReducer";
import storeReducer from "./storeReducer";
import navigationReducer from "./navigationReducer";

const rootReducer = combineReducers({
	accountReducer: accountReducer,
	cartReducer: cartReducer,
	storeReducer: storeReducer,
	navigationReducer: navigationReducer,
});

export default rootReducer;
