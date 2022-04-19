import React, { useEffect, useState } from "react";

import "./styles/ordersScreen/ordersScreen.css";
// graphql
import request, { gql } from "graphql-request";
import { formatTime, getTime } from "../utilityFunctions";
import DropdownMenu from "../components/DropdownMenu";
import OrdersModel from "../components/OrdersModel";
import Button from "../components/Button";
import { url } from "../config";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../components/Avatar";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { updateUnread } from "../actions/navigation";

// images
import image1 from "../images/undraw_empty_re_opql.svg";

import { v4 as uuidV4 } from "uuid";
import { useHistory } from "react-router-dom";

export default function OrdersScreen({ match: { path }, ...others }) {
	const [activeAccountIndex, setActiveAccountIndex] = useState(null);
	const [activeProductIndex, setActiveProductIndex] = useState(null);
	const [orders, setOrders] = useState([]);
	const [unpaid, setUnpaid] = useState(0);
	const [modelVisible, setModelVisible] = useState(false);
	const [isUser, setIsUser] = useState();
	const dispatch = useDispatch();
	const history = useHistory();
	const accountReducer = useSelector((state) => state.accountReducer);
	const navigationReducer = useSelector((state) => state.navigationReducer);
	const unread = (data) => dispatch(updateUnread(data));
	useEffect(async () => {
		// console.log(others);
		let isDefault = true;
		if (path == "/inbox") {
			isDefault = false;
			unread({
				unReadOrder: navigationReducer.dropdownOptions[1].count,
				unReadInbox: 0,
				isStore: accountReducer.userData.store,
			});
		} else {
			unread({
				unReadOrder: 0,
				unReadInbox: navigationReducer.dropdownOptions[2].count,
				isStore: accountReducer.userData.store,
			});
		}

		const query = gql`
			query GetOrders($type: Type!) {
				getOrders(type: $type) {
					status
					unPaid
					orders {
						id
						user {
							id
							imageUri
							username
						}
						product {
							id
							imageUri
							name
							price
						}
						quantity
						store {
							id
							name
							imageUri
						}
						uploadTime
						updatedTime
						read
						lastActive
					}
				}
			}
		`;
		const variables = {
			type: isDefault ? "USER" : "STORE",
		};
		const { getOrders } = await request(url, query, variables, {
			Authorization: `bearer ${accountReducer.token}`,
		});
		const orderData = [];

		setUnpaid(getOrders.unPaid);
		const header = isDefault ? "store" : "user";
		for (const item of getOrders.orders) {
			const order = orderData.find((order) => item[header].id === order.id);
			if (!order) {
				orderData.push({ ...item[header], products: [item] });
			} else {
				order.products.push(item);
			}
		}
		setIsUser(isDefault);
		setOrders(orderData);
	}, []);

	const handleSubmit = (isSuccess, values) => {
		setModelVisible(false);
		if (!isSuccess) return;

		// const order = orders.find((v) => v.id == activeOrder[0]);
		// const product = order.products.find((p) => p.id == activeOrder[1]);

		// console.log("values");
		// console.log(product);
		// console.log(orders[activeAccountIndex].products[activeProductIndex]);
		// return;

		let newProduct;
		if (isUser) {
			newProduct = {
				...orders[activeAccountIndex].products[activeProductIndex],
				status: values.status,
				message: values.description,
				lastActive: isUser ? "USER" : "STORE",
				uploadTime: getTime(),
				read: false,
			};
		} else {
			newProduct = {
				...orders[activeAccountIndex].products[activeProductIndex],
				status: "PENDING",
				meetTime: values.dateTime,
				details: values.description,
				lastActive: isUser ? "USER" : "STORE",
				uploadTime: getTime(),
				read: false,
			};
		}

		// const index = orders.findIndex((v) => v.id == activeOrder[0]);
		// const productIndex = order.products.findIndex(
		// 	(p) => p.id == activeOrder[1]
		// );
		const newOrder = [...orders];
		newOrder[activeAccountIndex].products[activeProductIndex] = newProduct;
		console.log("newOrder");
		console.log(newOrder);
		setOrders(newOrder);
	};

	const handleCancel = async (payload) => {
		const query = gql`
			mutation Mutation($type: Type!, $cancelOrderId: ID!) {
				cancelOrder(type: $type, id: $cancelOrderId) {
					status
					message
				}
			}
		`;
		const variables = {
			cancelOrderId: orders[activeAccountIndex].products[activeProductIndex].id,
			type: isUser ? "USER" : "STORE",
		};
		const headers = {
			Authorization: `bearer ${accountReducer.token}`,
		};
		const { cancelOrder } = await request(url, query, variables, headers);
		console.log(cancelOrder);

		// update state
		// const order = orders.find((v) => v.id == payload[0]);
		// const product = order.products.find((p) => p.id == payload[1]);
		const newProduct = {
			...orders[activeAccountIndex].products[activeProductIndex],
			status: "CANCEL",
			read: false,
		};

		// const index = orders.findIndex((v) => v.id == payload[0]);
		// const productIndex = order.products.findIndex((p) => p.id == payload[1]);
		const newOrder = [...orders];
		newOrder[activeAccountIndex].products[activeProductIndex] = newProduct;
		setOrders(newOrder);
	};

	const handleOption = (option, index) => {
		setActiveProductIndex(index);
		switch (option) {
			case "update order":
				setModelVisible(true);
				return;
			case "cancel order":
				handleCancel(index);
				return;
			default:
				return console.log("broken");
		}
	};
	const handleShowOrders = async (index) => {
		// return console.log("active account index", index);
		const ids = orders[index].products.map((item) => item.id);
		const query = gql`
			mutation MarkRead($type: Type!, $ids: [ID]!) {
				markRead(type: $type, ids: $ids) {
					status
				}
			}
		`;
		const variables = {
			type: isUser ? "USER" : "STORE",
			ids,
		};
		const headers = {
			Authorization: `bearer ${accountReducer.token}`,
			ids,
		};
		const { markRead } = await request(url, query, variables, headers);
		console.log(markRead);
		if (markRead.status == "success") setActiveAccountIndex(index);
	};
	const handleShortForm = (orders) => {
		const shortForm = [];
		for (const product of orders.products) {
			const isUsed = shortForm.find((v) => v.status == product.status);
			if (!isUsed) {
				shortForm.push({
					status: product.status,
					size: 1,
				});
			} else {
				isUsed.size++;
			}
		}
		return (
			<>
				{shortForm.map((item) => (
					<div className="shortForm-container" key={uuidV4()}>
						<span className="shortForm-size">{item.size}</span>
						<span className="shortForm-name">{item.status}</span>
						<div className="dot" />
					</div>
				))}
			</>
		);
	};
	return (
		<div className="orders body-container">
			{/* <pre> {JSON.stringify(activeOrder, null, 10)} </pre> */}
			{/* <pre> {JSON.stringify(orders, null, 2)} </pre> */}
			{modelVisible && (
				<div className="modal-container">
					<OrdersModel
						onSubmit={handleSubmit}
						orderId={orders[activeAccountIndex].products[activeProductIndex].id}
						isUser={isUser}
						// onClose={handleFormSubmit}
						// onClose={() => setModelVisible(false)}
					/>
				</div>
			)}
			<div className="header-container">
				<h2>{path.split("/")[1]}</h2>
			</div>
			{unpaid ? (
				<div className="outstanding-clients section">
					<div className="wrapper">
						<div className="outstanding-client-count">{unpaid}</div>
						<p>pending clients</p>
					</div>
					<Button onClick={() => history.push("/pricing")}>buy clients</Button>
				</div>
			) : null}
			{orders.length ? (
				<div className="order section">
					{orders.map((order, index) => (
						<Order
							order={order}
							onShowOrder={() => handleShowOrders(index)}
							isActive={activeAccountIndex === index}
							isUser={isUser}
							key={uuidV4()}
						/>
					))}
				</div>
			) : (
				<div className="no-result-container">
					<img src={image1} className="no-result" />
					<h4>no orders</h4>
				</div>
			)}
			{orders[activeAccountIndex] && (
				<div className="accountDetails-container section">
					{/* <pre>{JSON.stringify(activeAccountIndex, null, 2)}</pre> */}
					{/* <img src={activeAccountIndex.imageUri} alt={activeAccountIndex.name} /> */}
					<Avatar
						styles={{ marginRight: "10px" }}
						image={orders[activeAccountIndex].imageUri}
						name={orders[activeAccountIndex].name}
					/>
					<div>
						<h3 className="name">
							{orders[activeAccountIndex].name ||
								orders[activeAccountIndex].username}
						</h3>
						<div className="shortForms-wrapper">
							{handleShortForm(orders[activeAccountIndex])}
						</div>
					</div>
				</div>
			)}
			{orders[activeAccountIndex] &&
				orders[activeAccountIndex].products.map((item, index) => (
					<OrderDetails
						item={item}
						onOption={(e) => handleOption(e, index)}
						isUser={isUser}
						key={uuidV4()}
					/>
				))}
		</div>
	);
}

const Order = ({ order, onShowOrder, isUser, isActive }) => {
	const { id, imageUri, products } = order;
	const [isRead, setIsRead] = useState(true);
	useEffect(() => {
		for (const product of products) {
			const lastActiveIsUser = product.lastActive === "USER";
			if (lastActiveIsUser !== isUser) {
				setIsRead(false);
			}
		}
	}, []);
	const name = order.username || order.name;
	return (
		<div>
			{/* orders */}
			{/* <p>here{lastActive}</p> */}
			<div className="account" onClick={() => onShowOrder(order)}>
				{/* <img src={imageUri} alt={name} /> */}
				<div className={`avatar-wrapper ${isRead ? "" : "read"}`}>
					<Avatar image={imageUri} name={name} isActive={isActive} />
				</div>
				<h5>{name}</h5>
			</div>
		</div>
	);
};

const OrderDetails = ({ item, onOption, isUser }) => {
	const {
		id,
		product: { imageUri, name, price },
		quantity,
		uploadTime,
		updatedTime,
		meetTime,
		details,
		status,
		message,
		read,
		lastActive,
	} = item;
	const [isLastActiveUser, setIsLastActiveUser] = useState(null);
	useEffect(() => {
		console.log("ordersDetails resetting");
		const type = isUser ? "USER" : "STORE";
		if (lastActive !== type) return setIsLastActiveUser(false);
		return setIsLastActiveUser(true);
	}, []);
	const handleRead = () => {
		if (isLastActiveUser) {
			if (read == true) return <DoneAllIcon sx={{ fontSize: "18px" }} />;
			return <DoneIcon sx={{ fontSize: "18px" }} />;
		}
	};
	const paidAt = new Date(meetTime).toLocaleString(undefined, {
		timeZone: "UTC",
	});
	return (
		<div className="product-section section">
			{/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
			<img src={imageUri} alt={name} />
			<div>
				<div
					className={`productName-container ${isLastActiveUser ? "" : "read"}`}
				>
					<h3>{name}</h3>
					<DropdownMenu
						options={[
							{
								name: "update order",
							},
							{ name: "cancel order", type: "danger" },
						]}
						// index[1] orders.id index[2] product[index]
						// onOption={(e) => handleOption(e, [activeAccountIndex.id, index])}
						onOption={onOption}
					/>
				</div>
				<div className="pricing-container">
					<span>
						<h4>price: ₦{price}</h4>
					</span>
					<span>
						<h4>quantity: {quantity}</h4>
					</span>
					<span>
						<h4>total: ₦{price * quantity}</h4>
					</span>
				</div>
				<p className="inline-container">{status}</p>
				{/* STORE message */}
				{meetTime && (
					<div className="store-container">
						<h3>{isUser ? "store" : "me"},</h3>
						<h2>{paidAt}</h2>
						<p>{details}</p>
					</div>
				)}
				{meetTime && message && <hr />}
				{message && (
					<div className="user-container">
						<h3>{isUser ? "me" : "user"},</h3>
						<p>{message}</p>
					</div>
				)}
				<div className="timeRead-container">
					<h5>{formatTime(+updatedTime)}</h5>
					{handleRead()}
				</div>
			</div>
		</div>
	);
};
