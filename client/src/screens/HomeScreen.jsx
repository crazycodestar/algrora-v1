import React, { useState, useEffect } from "react";
//css
import "./styles/homeScreen/homeScreen.css";

import { v4 as uuidv4 } from "uuid";
import StoreIcon from "@mui/icons-material/Store";

import NavigationBar from "../components/NavigationBar";
import Product from "../components/Product";
import CartProduct from "../components/CartProduct";
import Button from "../components/Button";
import Category from "../components/Category";
import Tabs from "../components/Tabs";

import image1 from "../images/undraw_empty_re_opql.svg";
import image2 from "../images/undraw_web_shopping_re_owap.svg";

// redux
import { useSelector } from "react-redux";

// graphql
import graphqlClient from "../graphqlClient";
import request, { gql } from "graphql-request";
import useProducts from "../useProducts";
import { useHistory } from "react-router-dom";

const categories = [
	"all",
	"fashion",
	"electronics",
	"sports",
	"utensils",
	"clothing",
];

export default function HomeScreen() {
	const [page, setPage] = useState(1);
	const [showLeader, setShowLeader] = useState(true);

	const accountReducer = useSelector((state) => state.accountReducer);
	const history = useHistory();

	useEffect(() => {
		console.log(accountReducer);
		const displayLeader = JSON.parse(localStorage.getItem("notShowLeader"));
		if (
			displayLeader ||
			(accountReducer.userData && accountReducer.userData.store)
		)
			setShowLeader(false);
	}, []);

	const { isLoading, isNext, products } = useProducts({ page });

	const handleMorePages = () => {
		if (isNext) setPage(page + 1);
	};

	const handleCloseLeader = () => {
		localStorage.setItem("notShowLeader", JSON.stringify(true));
		setShowLeader(false);
	};

	const handleProducts = () => {
		if (!isLoading && !products.length)
			return (
				<div className="empty-container">
					<div className="no-results">
						<img src={image1} alt="no results" />
						<h4>no results</h4>
					</div>
				</div>
			);

		return (
			<>
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
					{isLoading && (
						<div className="empty-container">
							<div class="lds-ring">
								<div></div>
								<div></div>
								<div></div>
								<div></div>
							</div>
						</div>
					)}
				</div>
				{isNext ? (
					<Button
						style={{ marginLeft: "auto", marginRight: "auto" }}
						onClick={handleMorePages}
					>
						more products
					</Button>
				) : null}
			</>
		);
	};

	return (
		<div className="homeScreen body-container">
			{showLeader && (
				<div className="leader-container">
					<div className="details">
						<h1>set up shop.</h1>
						<p className="description">
							Create a store and expand your reach. Creating a store on our
							platform saves you the stress of a door-to-door salesman. The
							times of moving from room to room peaching your business over and
							over again is over. With algrora, simply setup your store with an
							eyecatching name and description and watch the customers roll in.
						</p>
						<div className="button-container">
							<Button
								onClick={() => history.push("/addStore")}
								icon={<StoreIcon fontSize="small" />}
							>
								Create
							</Button>
							<Button secondary onClick={handleCloseLeader}>
								no, thanks
							</Button>
						</div>
					</div>
					<div className="image-container">
						<img src={image2} alt="setup shop" />
					</div>
				</div>
			)}
			<div className="main-container">{handleProducts()}</div>
		</div>
	);
}
