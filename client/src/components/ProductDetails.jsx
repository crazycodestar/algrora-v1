import React from "react";

import "./styles/productDetails/productDetails.css";

export default function ProductDetails({ product }) {
	return (
		<div className="productDetails">
			<div className="productDetails-image-container">
				<img
					src={product.image}
					alt={product.name}
					className="productDetails-product-image"
				/>
			</div>
			<p>{product.name}</p>
		</div>
	);
}
