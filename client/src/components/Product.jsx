import React, { useState } from "react";

// css
import "./styles/product/product.css";

// placeholder Image
import DropdownMenu from "./DropdownMenu";
// external components
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

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
				<div className="image-container">
					<img src={image} alt="image" className="image" />
				</div>
				<div className="details-container">
					<div className="details-text">
						<p className="productname">{handleProductName(name)}</p>
						<p>₦{price}</p>
					</div>
					<Avatar
						image={brandImage}
						name={brand}
						styles={{ width: 25, height: 25 }}
					/>
				</div>
			</Link>
		</div>
	);
}
