import React, { useState, useEffect } from "react";

import "./styles/searchScreen/searchScreen.css";

import request, { gql } from "graphql-request";
import { url } from "../config";
import Product from "../components/Product";

import { v4 as uuidv4 } from "uuid";

export default function SearchScreen({ location }) {
	const [isLoading, setIsLoading] = useState(true);
	const [products, setProducts] = useState([]);
	useEffect(async () => {
		setIsLoading(true);
		const searchQuery = new URLSearchParams(location.search);
		const query = gql`
			query Query($search: String!) {
				search(search: $search) {
					name
					price
					id
					imageUri
					store {
						name
						imageUri
					}
				}
			}
		`;
		const variables = {
			search: searchQuery.get("search"),
		};
		const { search } = await request(url, query, variables);
		setProducts(search);
		setIsLoading(false);
	}, [location.search]);
	const handleProductRender = () => {
		if (isLoading) {
			return <p>loading Products</p>;
		} else if (!products.length) {
			return <p>no Products matching search term</p>;
		} else {
			return (
				<div className="product-wrapper">
					{products.map((item) => (
						<Product
							product={item}
							key={uuidv4()}
							style={{
								marginBottom: 10,
							}}
						/>
					))}
				</div>
			);
		}
	};
	return (
		<div className="searchScreen body-container">{handleProductRender()}</div>
	);
}
