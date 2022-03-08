import React, { useState } from "react";

// css
import "./styles/cartScreen/cartScreen.css";

// components
import CartProduct from "../components/CartProduct";
import NavigationBar from "../components/NavigationBar";
import Button from "../components/Button";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
	addCartProduct,
	decrementCartProduct,
	incrementCartProduct,
	removeCartProduct,
	clearCart,
} from "../actions/cart";

import { useHistory } from "react-router-dom";

// gql
import request, { gql } from "graphql-request";
import { url } from "../config";

export default function CartScreen() {
	const cartReducer = useSelector((state) => state.cartReducer.cartProducts);
	const accountReducer = useSelector((state) => state.accountReducer);

	const history = useHistory();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const dispatch = useDispatch();
	const removeFromCart = (key) => dispatch(removeCartProduct(key));
	const incrementQuantity = (product) =>
		dispatch(incrementCartProduct(product));
	const decrementQuantity = (product) =>
		dispatch(decrementCartProduct(product));
	const clearCartProducts = () => dispatch(clearCart());

	const handleChange = (item, procedure) => {
		const handleIncrement = () => {
			incrementQuantity(item);
		};
		const handleDecrement = () => {
			decrementQuantity(item);
		};
		const handleDelete = () => {
			removeFromCart(item.id);
		};
		switch (procedure) {
			case "increment":
				handleIncrement();
				break;
			case "decrement":
				handleDecrement();
				break;
			case "delete":
				handleDelete();
				break;
		}
	};
	const getQuantity = () => {
		const price = cartReducer.reduce((a, b) => {
			const secondValue = b.quantity * b.price;
			return a + secondValue;
		}, 0);
		return price;
	};
	const handleSubmit = async () => {
		if (!accountReducer.token) {
			console.log("need to login before buying");
			history.push("/login");
			return;
		}
		const orders = cartReducer.map((item) => {
			return {
				productId: item.id,
				storeId: item.store.id,
				quantity: item.quantity,
			};
		});
		const query = gql`
			mutation Mutation($orders: [OrderInput]!) {
				placeOrder(orders: $orders) {
					status
					message
				}
			}
		`;
		const variables = {
			orders,
		};
		const { placeOrder } = await request(url, query, variables, {
			Authorization: `bearer ${accountReducer.token}`,
		});
		console.log(placeOrder);
		if (placeOrder.status === "success") {
			clearCartProducts();
			history.push("./orders");
		}
	};
	return (
		<>
			<div className="cartScreen-container">
				{cartReducer && (
					<div className="cartProduct-container">
						{cartReducer.map((item) => {
							return (
								<CartProduct
									key={item.id}
									product={item}
									onChange={(procedure) => handleChange(item, procedure)}
								/>
							);
						})}
					</div>
				)}
				<div className="cartDetails-container">
					<table className="cart-summation">
						<tr className="header">
							<th>Product</th>
							<th>Price</th>
						</tr>
						{cartReducer.map((item) => (
							<tr className="body">
								<td>{item.name}</td>
								<td>₦{item.price * item.quantity}</td>
							</tr>
						))}
						<tr className="total-price-section">
							<td>total</td>
							<td>₦{getQuantity()}</td>
						</tr>
					</table>
					<Button onClick={handleSubmit} disabled={isSubmitting}>
						buy now
					</Button>
				</div>
			</div>
		</>
	);
}
