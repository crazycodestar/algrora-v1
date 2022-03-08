import React from "react";
//css
import "./styles/cartButton/cartButton.css";
// components
import Button from "./Button";

export default function CartButton({ quantity = 0, onChange }) {
	return (
		<div className="cartButton-container">
			{quantity === 0 ? (
				<Button onClick={() => onChange("increment")}>add to cart</Button>
			) : (
				<div className="quantity-section-container">
					<Button onClick={() => onChange("increment")}>+</Button>
					<span>{quantity}</span>
					<Button onClick={() => onChange("decrement")}>-</Button>
				</div>
			)}
		</div>
	);
}
