import React from "react";

import Button from "./Button";
import CartProduct from "./CartProduct";

export default function CartTab({ product }) {
	return (
		<>
			<div className="tabs-cartProducts-container">
				<CartProduct product={product} />
			</div>
			<div className="tabs-action-section">
				<div className="tabs-price-container">
					<p>total</p>
					<p>$200</p>
				</div>
				<Button
					style={{
						// display: "flex",
						margin: 0,
						width: "100%",
					}}
				>
					buy now
				</Button>
			</div>
		</>
	);
}
