import React, { useState, useEffect } from "react";
//css
import "./styles/accountScreen/accountScreen.css";

import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
// config
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../actions/account";
import { updateStore } from "../actions/store";

import NavigationBar from "../components/NavigationBar";
import Product from "../components/Product";
import CartProduct from "../components/CartProduct";
import Button from "../components/Button";
import Category from "../components/Category";
import ProductDetails from "../components/ProductDetails";
// images
import Tabs from "../components/Tabs";
import DropdownMenu from "../components/DropdownMenu";

// graphql
import request, { gql } from "graphql-request";
import { url } from "../config";

import image1 from "../images/undraw_empty_re_opql.svg";

const accountData = {
	image: "https://picsum.photos/200",
	username: "olalekan adekanmbi",
};

const categories = [
	"all",
	"fashion",
	"electronics",
	"sports",
	"utensils",
	"clothing",
];

const types = {
	addProduct: "add product",
	editAccount: "edit account",
	removeAccount: "remove account",
	signOut: "sign out",
	removeProduct: "remove product",
	updateProduct: "update product",
};

const accountOptions = [
	{ name: types.addProduct },
	{ name: types.editAccount },
	// { name: types.removeAccount, type: "danger" },
	{ name: types.signOut },
];

const productOptions = [
	{ name: types.updateProduct },
	{ name: types.removeProduct, type: "danger" },
];

export default function AccountScreen({
	history,
	match: {
		params: { id: id },
	},
}) {
	const [store, setStore] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	// redux
	const accountReducer = useSelector((state) => state.accountReducer);
	const dispatch = useDispatch();
	const signOut = () => dispatch(logOut());
	const addStore = (data) => dispatch(updateStore(data));

	// display model animation
	// display product details modal
	const [showProductDetails, setShowProductDetails] = useState(false);
	const [isStore, setIsStore] = useState(true);
	useEffect(async () => {
		const storeId = id || accountReducer.userData.store;
		if (storeId) {
			const query = gql`
				query Query($getStoreId: ID!) {
					getStore(id: $getStoreId) {
						status
						message
						store {
							name
							description
							imageUri
							activated
							products {
								id
								imageUri
								description
								name
								price
								tags
								store {
									name
									imageUri
								}
							}
						}
					}
				}
			`;

			const variables = {
				getStoreId: storeId,
			};

			const { getStore } = await request(url, query, variables);
			if (getStore.status === "success") {
				console.log(getStore);
				setStore(getStore.store);
			}
		}
		// if there is no id and dosen't have a store display addStore option
		if (!id && !accountReducer.userData.store) {
			setIsStore(false);
		}
		setIsLoading(false);
	}, []);
	const handleProductRender = () => {
		if (store.products && !store.products.length)
			return (
				<div className="empty-container">
					<h4>you have no products</h4>
					<Button onClick={() => handleOption(types.addProduct)}>
						add Product
					</Button>
				</div>
			);
		return (
			store.products &&
			store.products.map((item) => (
				<Product
					product={item}
					key={uuidv4()}
					style={{
						marginBottom: 10,
						position: "relative",
					}}
					account
					options={!handledropdown()}
					optionDetails={productOptions}
					optionAction={(action) => handleOption(action, item)}
				/>
			))
		);
	};
	const handleOption = async (type, payload) => {
		switch (type) {
			case types.addProduct:
				history.push("/addProduct");
				console.log("product-added");
				break;
			case types.updateProduct:
				// const imageUri = payload.imageUri.split("/").at(-1);
				history.push(
					`/addProduct?id=${payload.id}&images=${JSON.stringify([
						payload.imageUri,
					])}&productName=${payload.name}&productPrice=${
						payload.price
					}&productDescription=${payload.description}
					&productCategory=${JSON.stringify(payload.tags)}`
				);
				break;
			case types.editAccount:
				history.push(
					`/addStore?id=${
						id || accountReducer.userData.store
					}&isUpdate=true&storeName=${store.name}&storeDescription=${
						store.description
					}`
				);
				console.log("edit-account");
				break;
			case types.removeAccount:
				console.log("remove-account");
				break;
			case types.signOut:
				signOut();
				history.push("/signIn");
				console.log("sign-out");
				break;
			case types.removeProduct:
				const query = gql`
					mutation Mutation($id: ID!) {
						deleteProduct(id: $id) {
							status
							message
						}
					}
				`;
				const variables = {
					id: payload.id,
				};
				const headers = {
					Authorization: `bearer ${accountReducer.token}`,
				};
				const { deleteProduct } = await request(url, query, variables, headers);
				if (deleteProduct.status == "success") {
					const products = store.products.filter(
						(product) => product.id !== payload.id
					);
					setStore({ ...store, products });
				}
				break;
		}
	};
	const handledropdown = () => {
		if (typeof id === "undefined") {
			return false;
		}
		return true;
	};

	if (isLoading)
		return (
			<div className="empty-container">
				<div class="lds-ring">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		);

	if (!isStore) {
		return (
			<div className="messageAlert-container">
				<h2>oops, you seem to not own a store would you like to create one</h2>
				<Button onClick={() => history.push("/addStore")}>create store</Button>
			</div>
		);
	}

	if (!store.activated)
		return (
			<div className="messageAlert-container">
				<h2>
					oops, your store isn't not activated kindly choose a plan to activate
					your store
				</h2>
				<Button onClick={() => history.push("/pricing")}>see pricing</Button>
			</div>
		);

	return (
		<div className="accountScreen">
			<div className="account-wrapper">
				{/* account section */}
				<div className="details">
					<img
						src={store.imageUri}
						alt="account-image"
						className="accountImage"
					/>
					<div>
						<div>
							<p className="store">{store.name}</p>
							<DropdownMenu
								disabled={handledropdown()}
								onOption={handleOption}
								options={accountOptions}
							/>
						</div>
						<p className="description">{store.description}</p>
					</div>
				</div>
				<div className="product-section">
					<h1>Products</h1>
					<div className="product-wrapper">{handleProductRender()}</div>
				</div>
			</div>
		</div>
	);
}
