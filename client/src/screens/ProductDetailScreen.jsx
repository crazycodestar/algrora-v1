import React, { useState, useEffect } from "react";
// css
import "./styles/productDetailScreen/productDetailScreen.css";
// utitlity
import { formatTime, getTime } from "../utilityFunctions";

// graphql
import request, { gql } from "graphql-request";
import { url } from "../config";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
	addCartProduct,
	decrementCartProduct,
	incrementCartProduct,
	removeCartProduct,
} from "../actions/cart";
// components
import Button from "../components/Button";
import RatingDistribution from "../components/RatingDistribution";
import Comment from "../components/Comment";
import NavigationBar from "../components/NavigationBar";
import AddComment from "../components/AddComment";
import CartButton from "../components/CartButton";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";

const ratingDistribution = [
	{
		id: "1",
		name: "5",
		value: 9,
		noOfReviews: 12,
	},
	{
		id: "2",
		name: "4",
		value: 3,
		noOfReviews: 8,
	},
	{
		id: "3",
		name: "3",
		value: 2,
		noOfReviews: 3,
	},
	{
		id: "4",
		name: "2",
		value: 5,
		noOfReviews: 4,
	},
	{
		id: "5",
		name: "1",
		value: 2,
		noOfReviews: 8,
	},
];

const types = {
	removeProduct: "remove Product",
	updateProduct: "update Product",
};

const options = [
	{ name: types.updateProduct },
	{ name: types.removeProduct, type: "danger" },
];

export default function ProductDetailScreen({
	history,
	match: {
		params: { id: productId },
	},
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [details, setDetails] = useState({});
	const { id, imageUri, name, description, price, store, tags } = details;
	const [draftComment, setDraftComment] = useState("");
	const [userComment, setUserComment] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const accountReducer = useSelector((state) => state.accountReducer);
	useEffect(async () => {
		const query = gql`
			query Query($getProductId: ID!) {
				getProduct(id: $getProductId) {
					id
					imageUri
					name
					description
					price
					tags
					store {
						name
						imageUri
						id
					}
					comments {
						user {
							imageUri
							username
						}
						comment
						uploadTime
						likes
						disLikes
					}
				}
			}
		`;
		const variables = {
			getProductId: productId,
		};
		const { getProduct } = await request(url, query, variables);
		setUserComment(getProduct.comments);
		setDetails(getProduct);
		setIsLoading(false);
	}, []);

	const cartReducer = useSelector((state) => state.cartReducer.cartProducts);

	const dispatch = useDispatch();
	const addToCart = (product) => dispatch(addCartProduct(product));
	const removeFromCart = (key) => dispatch(removeCartProduct(key));
	const incrementQuantity = (product) =>
		dispatch(incrementCartProduct(product));
	const decrementQuantity = (product) =>
		dispatch(decrementCartProduct(product));

	const productData = cartReducer.find((product) => product.id === id);
	const handleChange = (procedure) => {
		const handleIncrement = () => {
			if (!productData) {
				addToCart({ ...details, quantity: 1 });
			} else {
				incrementQuantity(details);
			}
		};
		const handleDecrement = () => {
			if (productData.quantity === 1) {
				removeFromCart(id);
			} else {
				decrementQuantity(details);
			}
		};

		switch (procedure) {
			case "increment":
				handleIncrement();
				break;
			case "decrement":
				handleDecrement();
				break;
		}
	};

	const handlePost = async () => {
		if (draftComment && typeof draftComment != "undefined") {
			const date = new Date();
			const { username, imageUri } = accountReducer.userData;
			const commentTemplate = {
				id: userComment.length + 1,
				user: { username: username, imageUri: imageUri },
				comment: draftComment,
				uploadTime: getTime(),
				likes: 0,
				dislikes: 0,
			};

			const query = gql`
				mutation Mutation($addCommentId: ID!, $comment: String!) {
					addComment(id: $addCommentId, comment: $comment) {
						status
						message
					}
				}
			`;
			const variables = {
				addCommentId: productId,
				comment: draftComment,
			};

			const { addComment } = await request(url, query, variables, {
				Authorization: `bearer ${accountReducer.token}`,
			});

			if ((addComment.status = "success")) {
				setUserComment(userComment.concat(commentTemplate));
				setDraftComment("");
			}
		}
	};

	const handleUpdate = () => {
		history.push(
			`/addProduct?id=${id}&images=${JSON.stringify([
				imageUri,
			])}&productName=${name}&productPrice=${price}&productDescription=${description}
			&productCategory=${JSON.stringify(tags)}`
		);
	};

	const handleAction = (action) => {
		switch (action) {
			case types.removeProduct:
				return console.log("removing Product");
			case types.updateProduct:
			// return navigation.push("AddProductScreen");
		}
	};

	const handleButtonDisplay = () => {
		console.log("accountReducer");
		console.log(accountReducer);
		if (
			Object.entries(accountReducer).length &&
			accountReducer.userData.store === store.id
		)
			return <Button onClick={handleUpdate}>edit product</Button>;
		return (
			<CartButton
				quantity={productData === undefined ? 0 : productData.quantity}
				onChange={handleChange}
			/>
		);
	};
	return (
		<>
			{isLoading ? (
				<p>loading</p>
			) : (
				<>
					<div className="cartScreen body-container">
						<div className="cartScreen-main-container">
							{/* <pre>{JSON.stringify(store, null, 2)}</pre>
							<pre>{JSON.stringify(accountReducer, null, 2)}</pre> */}
							<div className="cartScreen-image-container">
								<img
									src={imageUri}
									alt={name}
									className="cartScreen-product-image"
								/>
							</div>
							<div className="cartScreen-details-container">
								<p className="cartScreen-product-name">{name}</p>
								<Link to={`/store/${store.id}`}>
									<div className="cartScreen-account-container">
										<img
											src={store.imageUri}
											alt={store.name}
											className="cartScreen-account-image-container"
										/>
										<p className="cartScreen-account-name">{store.name}</p>
									</div>
								</Link>

								{/* <p className="cartScreen-dummy-rating">rating</p> */}
								{false && <Rating rating={3.5} />}
								<p className="cartScreen-description">
									<p
										style={{
											fontSize: 18,
											fontWeight: "600",
											marginBottom: 3,
										}}
									>
										Description
									</p>
									{description}
								</p>
								<div className="cartScreen-price-container">
									<p className="cartScreen-product-price">₦{price}</p>
									{/* <div>
										<p className="cartScreen-product-old-price">${price}</p>
										<p className="cartScreen-product-discount">-5%</p>
									</div> */}
								</div>
								{handleButtonDisplay()}
							</div>
						</div>
						{false && (
							<div className="cartScreen-feedback-container">
								<p>Feedback</p>
								<div>
									<RatingDistribution
										style={{}}
										ratingDistribution={ratingDistribution}
									/>
									<div className="comment-section">
										<p className="comment-section-heading">Comments</p>
										{accountReducer.token && (
											<AddComment
												commentValue={draftComment}
												onComment={(e) => setDraftComment(e.target.value)}
												onPost={handlePost}
											/>
										)}
										{userComment.map((item) => (
											<Comment comment={item} />
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
}
