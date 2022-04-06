import { Check } from "@material-ui/icons";
import request, { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { url, header } from "../config";

import { useSelector } from "react-redux";

import "./styles/categoryScreen/categoryScreen.css";

export default function CategoryScreen({ history }) {
	const [categories, setCategories] = useState([]);
	const [selected, setSelected] = useState([]);

	const accountReducer = useSelector((state) => state.accountReducer);

	useEffect(async () => {
		const query = gql`
			query GetCategories {
				getCategories {
					id
					name
					description
					imageUri
				}
			}
		`;
		const { getCategories } = await request(url, query);
		setCategories(getCategories);
	}, []);

	const handleTick = (obj) => {
		const isSelected = selected.find((item) => item.name === obj.name);
		if (isSelected) return <Check sx={{ fontSize: 18, color: "black" }} />;
	};

	const handleClick = (category) => {
		const isSelected = selected.find((item) => item.name === category.name);
		if (isSelected)
			return setSelected(
				selected.filter((item) => item.name !== category.name)
			);
		return setSelected([...selected, category]);
	};

	const handleButtonDisplay = () => {
		if (selected.length < 3) return `(${3 - selected.length}) remaining`;
		return "proceed";
	};

	const handleSubmit = async () => {
		const ids = selected.map((item) => item.id);

		const query = gql`
			mutation AddInterests($interests: [ID!]!) {
				addInterests(interests: $interests)
			}
		`;
		const variables = {
			interests: ids,
		};
		const { addInterests } = await request(
			"/graphql",
			query,
			variables,
			header(accountReducer.token)
		);

		console.log(addInterests);

		if (addInterests === "success") {
			return history.push("/");
		}
	};

	return (
		<div className="categoryScreen body-container">
			<div className="main-container">
				<div>
					<h1>Select your interest</h1>
					<h4>select at least 3 interest</h4>
				</div>
				<Button
					style={{ height: "fit-content" }}
					onClick={handleSubmit}
					disabled={selected.length < 3}
				>
					{handleButtonDisplay()}
				</Button>
			</div>
			{/* <pre>{JSON.stringify(selected, null, 2)}</pre> */}
			<div className="category-section">
				{categories.length
					? categories.map((category) => (
							<div
								className="category-item-container"
								onClick={() => handleClick(category)}
							>
								<div className="marked-read">{handleTick(category)}</div>
								<div className="category-image-container">
									<img
										src={category.imageUri}
										alt={category.name}
										className="category-image"
									/>
								</div>
								<h3 className="category-name">{category.name}</h3>
							</div>
					  ))
					: null}
			</div>
			{/* <pre>{JSON.stringify(categories, null, 2)}</pre> */}
		</div>
	);
}
