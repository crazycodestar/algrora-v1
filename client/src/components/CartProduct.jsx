import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// components
import Button from "./Button";

import "./styles/cartProduct/cartProduct.css";
import CartButton from "./CartButton";
// react-router-dom
import { useHistory } from "react-router";
// import image from "../images/photo-1583394838336-acd977736f90.jpg";

export default function CartProduct({ product, onChange }) {
	const { imageUri, name, price, store, id } = product;
	const history = useHistory();
	const handleProductName = (name) => {
		// return name.slice(0, 19) + "...";
		return name;
	};
	return (
		<div className="cartProduct-container">
			<img src={imageUri} alt="headphones" className="cartProduct-image" />
			<div className="cartProduct-content-container">
				<p
					className="cartProduct-name-text"
					onClick={() => history.push(`/product/${id}`)}
				>
					{handleProductName(name)}
				</p>
				<div
					onClick={() => history.push(`/store/${store.id}`)}
					className="cartProduct-account-container"
				>
					<img
						src={store.imageUri}
						alt={store.name}
						className="store-image"
						style={{
							width: 25,
							height: 25,
							backgroundColor: "yellow",
							borderRadius: "50%",
							marginRight: 5,
						}}
					/>
					<p>{store.name}</p>
				</div>
				<p className="cartProduct-price-text">₦{price}</p>
			</div>
			<div className="cartProduct-button-container">
				<CartButton quantity={product.quantity} onChange={onChange} />
				<Button secondary onClick={() => onChange("delete")}>
					<FontAwesomeIcon icon={faTimes} />
				</Button>
			</div>
		</div>
	);
}
