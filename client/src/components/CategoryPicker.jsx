import React, { useState } from "react";
// css
import "./styles/categoryPicker/categoryPicker.css";
// components
import Button from "./Button";

const DATA = [
	{
		id: "1",
		icon: "electric-switch",
		name: "electronics",
	},
	{
		id: "2",
		icon: "toilet",
		name: "toiletries",
	},
	{
		id: "3",
		icon: "hanger",
		name: "wears",
	},
	{
		id: "4",
		icon: "book",
		name: "books",
	},
	{
		id: "5",
		icon: "diamond-outline",
		name: "jewelry ",
	},
	{
		id: "6",
		icon: "food-drumstick",
		name: "food stuff",
	},
	{
		id: "7",
		icon: "spray-bottle",
		name: "beauty",
	},
	{
		id: "8",
		icon: "more",
		name: "others",
	},
];

export default function CategoryPicker() {
	const [showModal, setShowModal] = useState(false);
	const [currentCategory, setCurrentCategory] = useState(null);
	const handleClick = () => {
		setShowModal(!showModal);
	};

	const handleSelectCategory = (item) => {
		setShowModal(false);
		setCurrentCategory(item);
	};

	return (
		<div className="categoryPicker-container">
			<Button secondary onClick={handleClick}>
				{currentCategory ? currentCategory.name : "select category"}
			</Button>
			{showModal && (
				<ul className="picker-wrapper">
					{DATA.map((item) => (
						<li onClick={() => handleSelectCategory(item)} key={item.id}>
							{item.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
