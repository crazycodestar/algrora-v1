import React from "react";

//css
import "./styles/tabs/tabs.css";

// components
import ProductDetails from "./ProductDetails";
import CartTab from "./CartTab";

export default function Tabs({ product, tabsArray }) {
	return (
		<div className="tabs-cart-container">
			<div className="tabs-header-container">
				<Header name="cart" />
				<Header name="Product details" />
			</div>
			<div className="tabs-content-container">
				{/* <div className="tabs-content-item">
					<CartTab product={product} />
				</div> */}
				<div className="tabs-content-item">
					<ProductDetails product={product} />
				</div>
			</div>
		</div>
	);
}

const Header = ({ name }) => (
	<div className="header-container">
		<p className="header-text">{name}</p>
	</div>
);
