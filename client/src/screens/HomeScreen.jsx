import React, { useState, useEffect } from "react";
//css
import "./styles/homeScreen/homeScreen.css";

import { v4 as uuidv4 } from "uuid";

import NavigationBar from "../components/NavigationBar";
import Product from "../components/Product";
import CartProduct from "../components/CartProduct";
import Button from "../components/Button";
import Category from "../components/Category";
import Tabs from "../components/Tabs";

import image1 from "../images/undraw_empty_re_opql.svg";

// redux
import { useSelector } from "react-redux";

// graphql
import graphqlClient from "../graphqlClient";
import { gql } from "graphql-request";

const categories = [
	"all",
	"fashion",
	"electronics",
	"sports",
	"utensils",
	"clothing",
];

export default function HomeScreen() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const accountReducer = useSelector((state) => state.accountReducer);
	useEffect(async () => {
		console.log(accountReducer);
		// fetch("http://localhost:5000/api/home")
		// 	.then((res) => res.json())
		// 	.then((data) => {
		// 		return setProducts(data);
		// 	})
		// 	.catch((err) => console.log(err));
		const query = gql`
			query Query {
				getProducts {
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
		const data = await graphqlClient.request(query);
		setProducts(data.getProducts);

		setIsLoading(false);
	}, []);

	if (isLoading)
		return (
			<div className="empty-container">
				<div class="lds-ring">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		);

	if (!products.length)
		return (
			<div className="empty-container">
				<div className="no-results">
					<img src={image1} alt="no results" />
					<h4>no results</h4>
				</div>
			</div>
		);
	return (
		<div className="homeScreen body-container">
			<div className="main-container">
				<div className="product-section">
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
				</div>
			</div>
		</div>
	);
}
