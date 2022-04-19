import React, { useEffect, useState } from "react";
import request, { gql } from "graphql-request";

import { Close } from "@material-ui/icons";

const TagPicker = ({ name, values, onChange }) => {
	const [categories, setCategories] = useState([]);

	useEffect(async () => {
		const query = gql`
			query Query {
				getCategories {
					id
					name
					description
				}
			}
		`;
		const { getCategories } = await request("/graphql", query);
		setCategories(getCategories);
		return () => {
			setCategories([]);
		};
	}, []);

	const handleClick = (option) => {
		const updatedOptions = [...values, option.id];
		onChange(name, updatedOptions);
	};

	const handleRemove = (option) => {
		const updatedOptions = values.filter((item) => item !== option.id);
		onChange(name, updatedOptions);
	};

	const handleCategories = () => {
		const updatedCategories = categories.filter((item) => {
			const isUsed = values.find((v) => v === item.id);
			if (isUsed) return false;
			return true;
		});
		return (
			<>
				{updatedCategories.map((option) => {
					return (
						<div className="option-wrapper" onClick={() => handleClick(option)}>
							<p>{option.name}</p>
						</div>
					);
				})}
			</>
		);
	};

	// return <pre>{JSON.stringify(categories, null, 2)}</pre>;
	// return (
	// 	<div className="tagPicker">
	// 		<div className="options">
	// 			{values &&
	// 				values.map((cat) => {
	// 					return <p>{cat}</p>;
	// 				})}
	// 		</div>
	// 	</div>
	// );
	if (categories.length && values.length)
		return (
			<div className="tagPicker">
				<div className="options">
					{values.map((cat) => {
						const option = categories.find((item) => item.id === cat);
						return (
							<div
								className="option-wrapper"
								onClick={() => handleRemove(option)}
								key={option.id}
							>
								<p>{option.name}</p>
								<Close fontSize="small" />
							</div>
						);
					})}
				</div>
				<h3>tags</h3>
				<p>select tags that fit your product from the options provided below</p>
				<div className="options">{handleCategories()}</div>
			</div>
		);

	return <p>loading</p>;
};

export default TagPicker;
