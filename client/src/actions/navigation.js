import { UPDATE_UNREAD } from "./types";

export const updateUnread = (data) => ({
	type: UPDATE_UNREAD,
	data,
});
