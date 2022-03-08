import { LOG_IN, LOG_OUT, UPDATE_ACCOUNT_DATA } from "./types";

export const login = (data) => ({
	type: LOG_IN,
	data: data,
});

export const update = (data) => ({
	type: UPDATE_ACCOUNT_DATA,
	data,
});

export const logOut = () => ({
	type: LOG_OUT,
});
