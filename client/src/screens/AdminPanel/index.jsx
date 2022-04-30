import React, { useState } from "react";
import { AccountCircle } from "@material-ui/icons";

import Input from "../../components/Input";

import "./adminPanel.css";
import Button from "../../components/Button";
import useAdmin from "../../hooks/useAdmin";
import ActivityIndicator from "../../components/ActivityIndicator";
import NoResults from "../../components/NoResults";

// import NavigationBar from "../components/NavigationBar";
// import SideNavigationBar from "../components/SideNavigationBar";

export default function AdministrativePanel() {
	const [isAdmin, setIsAdmin] = useState(false);
	const [value, setValue] = useState("loremIpsum");

	const { isNext, state, isLoading } = useAdmin();

	const handleChange = (e) => {
		setValue(e.target.value);
	};

	const handleSubmit = () => {
		if (value === "loremIpsum") {
			setIsAdmin(true);
		}
	};

	if (!isAdmin)
		return (
			<div className="admin-sign-in-container body-container empty-container">
				<div className="content">
					<h1>Admin, login in</h1>
					<p>login as an admin or Employee</p>
					<div className="form-container">
						<Input
							value={value}
							onEnter={handleSubmit}
							onChange={handleChange}
							Icon={AccountCircle}
							placeholder="password"
							type="password"
						/>
						<Button onClick={handleSubmit}>submit</Button>
					</div>
				</div>
			</div>
		);

	const handleOrders = () => {
		if (isLoading)
			return (
				<div className="empty-container">
					<ActivityIndicator />
				</div>
			);

		if (!state.orders.length)
			return (
				<div className="empty-container">
					<NoResults />
				</div>
			);
		return state.orders.map((order) => <OrderListings order={order} />);
	};

	return (
		<div className="admin-container content-container">
			<h2>Orders</h2>
			{handleOrders()}
		</div>
	);
}

const OrderListings = ({ order }) => {
	return (
		<div>
			<pre style={{ marginBottom: 30 }}>{JSON.stringify(order, null, 5)}</pre>
		</div>
	);
};
