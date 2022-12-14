import React, { useMemo, useEffect } from "react";
import Avatar from "../components/Avatar";

import "./styles/orderScreen/OrderScreen.css";

import useOrders from "../hooks/useQuery/useOrders";
import { useDispatch, useSelector } from "react-redux";
import { updateUnread } from "../actions/navigation";
import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";

import { useHistory } from "react-router-dom";
import NoResults from "../components/NoResults";

export default function OrderScreen({ match: { path } }) {
	const isUser = path === "/orders";
	const { loading, state, setActive } = useOrders({ isUser });

	const dispatch = useDispatch();
	const unread = (data) => dispatch(updateUnread(data));

	const navigationReducer = useSelector((state) => state.navigationReducer);
	const accountReducer = useSelector((state) => state.accountReducer);

	useEffect(() => {
		if (!isUser) {
			unread({
				unReadOrder: navigationReducer.dropdownOptions[2].count,
				unReadInbox: 0,
				isStore: accountReducer.userData.store,
			});
		} else {
			unread({
				unReadOrder: 0,
				unReadInbox: navigationReducer.dropdownOptions[3].count,
				isStore: accountReducer.userData.store,
			});
		}
	}, []);

	const headers = (() => {
		console.log("resetting");
		return Object.entries(state).length
			? state.userOrders.map(({ root }) => {
					return {
						id: root.id,
						imageUri: root.imageUri,
						username: root.username,
						active: root.active,
					};
			  })
			: null;
	})();

	const root = (() => {
		console.log("root");
		if (Object.entries(state).length) {
			const order = state.userOrders.find(({ root }) => root.active);
			if (order) return order.root;
		}
		return null;
	})();

	const orders = (() => {
		console.log("orders");
		if (Object.entries(state).length) {
			const order = state.userOrders.find(({ root }) => root.active);
			if (order) return order.orders;
		}
		return null;
	})();

	if (loading)
		return (
			<div className="empty-container">
				<ActivityIndicator />
			</div>
		);

	return (
		<div className="orderScreen body-container content-container">
			{state.unPaid ? <PendingPayments amount={state.unPaid} /> : null}
			{headers.length ? (
				<RootDisplay headers={headers} onClick={setActive} />
			) : (
				<div className="empty-container">
					<NoResults style={{ width: "200px", height: "200px" }} />
				</div>
			)}
			{root && <Details root={root} />}
			{orders && <Orders orders={orders} />}
		</div>
	);
}

const PendingPayments = ({ amount }) => {
	const history = useHistory();
	return (
		<div className="pendingPayments section">
			<div>
				<span>{amount}</span> <p>pending clients</p>
			</div>
			<Button onClick={() => history.push("/pricing")}>Buy Tokens</Button>
		</div>
	);
};

const RootDisplay = ({ headers, onClick }) => {
	return (
		<div className="headings-container section">
			{headers.map((header) => {
				const { username, imageUri, id, active } = header;
				return (
					<div>
						<Avatar
							onClick={() => onClick(id)}
							image={imageUri}
							name={username}
							isActive={active}
						/>
						<p>{username}</p>
					</div>
				);
			})}
		</div>
	);
};

const Details = ({ root }) => {
	const { imageUri, username, roomAddress, tel } = root;
	return (
		<div className="details-container section">
			<Avatar image={imageUri} name={username} />
			<div className="detail">
				<h3>{username}</h3>
				<p>roomAddress</p>
				<h4>{roomAddress}</h4>
				<p>tel</p>
				<h4>{tel}</h4>
			</div>
		</div>
	);
};

const Orders = ({ orders }) => {
	return (
		<div className="ordersDetails-container">
			{orders.map((order) => {
				const { product, quantity, orderId } = order;
				return (
					<div key={orderId} className="orderDetails-container">
						<div className="productDetails-container">
							<div className="image-container">
								<img
									className="orderImage"
									alt={product.name}
									src={product.imageUri}
								/>
							</div>
							<div className="content">
								<h3>{product.name}</h3>
								<p>???{product.price}</p>
							</div>
						</div>
						<p>{quantity}</p>
						<p>???{product.price * quantity}</p>
					</div>
				);
			})}
		</div>
	);
};
