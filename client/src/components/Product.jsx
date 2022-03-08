import React, { useState } from "react";

// css
import "./styles/product/product.css";

// placeholder Image
import DropdownMenu from "./DropdownMenu";
// external components
import { Link } from "react-router-dom";

export default function Product({
	account = false,
	product,
	style,
	onClick,
	options = false,
	optionDetails,
	optionAction,
}) {
	const [showOptions, setShowOptions] = useState(false);
	const {
		id,
		name,
		price,
		imageUri: image,
		store: { name: brand, imageUri: brandImage },
	} = product;
	const handleProductName = (name) => {
		if (name.length > 20) return name.slice(0, 19) + "...";
		return name;
	};
	return (
		<div
			className="product-container"
			style={style}
			onClick={onClick}
			onMouseEnter={() => setShowOptions(true)}
			onMouseLeave={() => setShowOptions(false)}
		>
			{options && showOptions && (
				<div style={{ position: "absolute", top: 0, right: 0 }}>
					<DropdownMenu options={optionDetails} onOption={optionAction} />
				</div>
			)}
			<Link to={`/product/${id}`}>
				<img src={image} alt="image" className="image" />
				<div className="details-container">
					<div className="details-text">
						<p className="productname">{handleProductName(name)}</p>
						<p>₦{price}</p>
					</div>
					{!account && (
						<img src={brandImage} alt={brand} className="brandImage" />
					)}
				</div>
			</Link>
		</div>
	);
}
