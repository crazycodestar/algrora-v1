import { useEffect, useState, useReducer } from "react";
import request, { gql } from "graphql-request";
import produce from "immer";

const type = {
	SETVALUES: "setValues",
};

const reducer = produce((state, action) => {
	switch (action.type) {
		case type.SETVALUES:
			state.orders = action.payload;
			break;

		default:
			throw new Error("this isn't a viable dispatch");
	}
});

export default function useAdmin() {
	const [state, dispatch] = useReducer(reducer, { index: 1 });
	const [isLoading, setIsLoading] = useState(true);
	const [isNext, setIsNext] = useState(false);

	useEffect(async () => {
		setIsLoading(true);
		const query = gql`
			query GetAdminOrders($page: Int!) {
				getAdminOrders(page: $page) {
					isNext
					orders {
						product {
							name
							price
							id
							imageUri
						}
						quantity
						store {
							name
							imageUri
						}
						uploadTime
						user {
							username
							imageUri
							id
						}
						id
						orderKey
						updatedTime
						lastActive
						read
						activated
					}
				}
			}
		`;
		const variables = {
			page: 1,
		};
		const { getAdminOrders } = await request("/graphql", query, variables);
		dispatch({ type: type.SETVALUES, payload: getAdminOrders.orders });
		setIsLoading(false);
	}, []);

	return { isNext, state, isLoading };
}
