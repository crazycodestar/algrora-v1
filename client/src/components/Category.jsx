import React, { useState } from "react";
// external
import { v4 as uuidv4 } from "uuid";

import "./styles/category/category.css";

export default function Category({ categories }) {
	const [activeCategory, setActiveCategory] = useState("sports");
	const handleClick = (item) => {
		setActiveCategory(item);
	};
	return (
		<div className="category-container">
			{/* <div className="category-opacity category-opacity-right" /> */}
			{/* <div className="category-opacity category-opacity-left" /> */}
			{categories.map((item) => (
				<CategoryCard
					category={item}
					key={uuidv4()}
					onClick={() => handleClick(item)}
					selected={activeCategory == item}
				/>
			))}
		</div>
	);
}

const CategoryCard = ({ category, selected, onClick }) => {
	return (
		<div
			className={`categoryCard-container ${
				selected ? "categoryCard-selected" : ""
			}`}
			onClick={onClick}
		>
			<p className="categoryCard-text">{category}</p>
		</div>
	);
};
