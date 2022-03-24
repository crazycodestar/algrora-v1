import { UPDATE_UNREAD } from "../actions/types";

// dropdown icons
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InboxIcon from "@mui/icons-material/Inbox";
import LogoutIcon from "@mui/icons-material/Logout";

const initialState = {
	dropdownOptions: [
		{ name: "My Account", icon: StoreMallDirectoryIcon },
		// { name: "Orders" },
		{ name: "Orders", icon: ShoppingCartIcon, count: 0 },
		{ name: "Inbox", icon: InboxIcon, count: 0 },
		// { name: "Saved Items" },
		{ name: "LOGOUT", type: "danger", icon: LogoutIcon },
	],
};

const navigationReducer = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_UNREAD:
			const updatedOptions = [...state.dropdownOptions];
			let inbox = {};
			if (action.data.isStore) {
				inbox = {
					name: "Inbox",
					icon: InboxIcon,
					count: action.data.unReadInbox,
				};
			}
			updatedOptions.splice(
				1,
				2,
				{
					name: "Orders",
					icon: ShoppingCartIcon,
					count: action.data.unReadOrder,
				},
				inbox
			);
			return { ...state, dropdownOptions: updatedOptions };

		default:
			return state;
	}
};

export default navigationReducer;
