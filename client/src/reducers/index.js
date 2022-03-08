import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import cartReducer from "./cartReducer";
import storeReducer from "./storeReducer";

const rootReducer = combineReducers({
	accountReducer: accountReducer,
	cartReducer: cartReducer,
	storeReducer: storeReducer,
});

export default rootReducer;
