import request, { gql } from "graphql-request";
import React, { useEffect, useReducer, useCallback, useState } from "react";
import { useSelector } from "react-redux";

import produce from "immer";

import { header } from "../../config";

const types = {
	SETDETAILS: "setDetails",
	SETACTIVE: "setActive",
	MARKREAD: "markRead",
};

const reducer = produce((state, action) => {
	switch (action.type) {
		case types.SETDETAILS:
			return (state = { ...action.payload });
		case types.SETACTIVE:
			state.userOrders.forEach((order) => {
				order.root.active = false;
			});
			const order = state.userOrders.find(
				(item) => item.root.id === action.payload.id
			);
			order.root.active = true;
			break;
		case types.MARKREAD:
			const orderItem = state.userOrders.find(
				(item) => item.root.id === action.payload.id
			);
			orderItem.root.read = true;
			break;
		// return (root.active = true);
		default:
			break;
	}
});

export default function useOrders({ isUser }) {
	const [state, dispatch] = useReducer(reducer, {});
	const { token } = useSelector((state) => state.accountReducer);
	const [loading, setLoading] = useState(true);

	useEffect(async () => {
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
							roomAddress
							tel
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
						orderKey
					}
				}
			}
		`;

		const variables = {
			type: isUser ? "USER" : "STORE",
		};

		const { getOrders } = await request(
			"/graphql",
			query,
			variables,
			header(token)
		);
		if (getOrders.status === "success") {
			const orders = getOrders.orders;
			const roots = [];
			orders.forEach((order) => {
				const root = isUser ? order.store : order.user;
				const index = roots.findIndex((item) => item.root.id === root.id);
				const orderDetails = {
					product: order.product,
					orderId: order.id,
					quantity: order.quantity,
				};
				if (index < 0) {
					const header = {
						root: { ...root, active: false },
						orders: [orderDetails],
					};

					return roots.push(header);
				}

				roots[index].orders = [orderDetails, ...roots[index].orders];
				return;
			});
			dispatch({
				type: types.SETDETAILS,
				payload: { unPaid: getOrders.unPaid, userOrders: roots },
			});
		}
		setLoading(false);
	}, []);

	const markRead = async (id) => {
		const userOrder = state.userOrders.find(({ root }) => root.id === id);
		if (userOrder.root.read) return;

		const query = gql`
			mutation Mutation($type: Type!, $ids: [ID]!) {
				markRead(type: $type, ids: $ids) {
					status
				}
			}
		`;
		// return console.log(state.userOrders);
		const ids = userOrder.orders.map((order) => {
			return order.orderId;
		});

		const variables = {
			type: isUser ? "USER" : "STORE",
			ids,
		};

		const { markRead } = await request(
			"/graphql",
			query,
			variables,
			header(token)
		);

		console.log(markRead);
		if (markRead.status == "success") {
			dispatch({ type: types.MARKREAD, payload: { id } });
		}
	};

	const setActive = useCallback(
		(id) => {
			console.log("state");
			console.log(state);
			markRead(id);
			dispatch({ type: types.SETACTIVE, payload: { id } });
		},
		[state]
	);

	return { loading, state, setActive };
}
