import request, { gql } from "graphql-request";
import { useState, useEffect } from "react";

export default function useProducts({ page }) {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isNext, setIsNext] = useState(false);

	useEffect(async () => {
		setIsLoading(true);
		const query = gql`
			query Query($page: Int!) {
				getProducts(page: $page) {
					products {
						name
						price
						id
						imageUri
						store {
							name
							imageUri
						}
					}
					isNext
				}
			}
		`;

		// const data = await graphqlClient.request(query);
		const { getProducts } = await request("/graphql", query, { page });
		setProducts([...products, ...getProducts.products]);
		setIsNext(getProducts.isNext);
		setIsLoading(false);
	}, [page]);
	return { products, isNext, isLoading };
}
