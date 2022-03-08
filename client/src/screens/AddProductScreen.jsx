import React, { useState, useEffect, useRef } from "react";

// css
import "./styles/addProductScreen/addProductScreen.css";

// components
import Button from "../components/Button";
import { Formik, Form, Field, FieldArray, useField } from "formik";
import * as Yup from "yup";
import InputValidation from "../components/validation/InputValidation";
import TextBoxValidation from "../components/validation/TextBoxValidation";
import ImageSelector from "../components/ImageSelector";
import Tags from "../components/Tags";

import { useLocation } from "react-router-dom";

//redux
import { useSelector } from "react-redux";
import { generateFilename } from "../utilityFunctions";
// graphql
import { url } from "../config";
import request, { gql } from "graphql-request";

import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function AddProductScreen({ history }) {
	const [activeData, setActiveData] = useState(null);
	const [productId, setProductId] = useState();
	const init = useLocation();
	const ProductValidationSchema = Yup.object().shape({
		images: productId ? Yup.array() : Yup.array().min(1).max(3).required(),
		productName: Yup.string().min(3).max(100).required(),
		productPrice: Yup.number().required().positive().integer(),
		productDescription: Yup.string().min(20).max(400).required(),
		productCategory: Yup.array().min(2).required(),
	});
	const initialValues = {
		images: [],
		productName: "",
		productPrice: 0,
		productDescription: "",
		productCategory: [],
	};
	useEffect(() => {
		const params = new URLSearchParams(init.search);
		if (!params.get("id")) return;
		const images = JSON.parse(params.get("images"));
		const tags = JSON.parse(params.get("productCategory"));
		const updateParams = {
			images,
			productName: params.get("productName"),
			productPrice: params.get("productPrice"),
			productDescription: params.get("productDescription"),
			productCategory: tags, // to be solved
		};
		// console.log(updateParams);
		setProductId(params.get("id"));
		setActiveData(updateParams);
	}, []);
	const accountReducer = useSelector((state) => state.accountReducer);
	return (
		<div className="addProduct-container">
			<Formik
				initialValues={activeData || initialValues}
				enableReinitialize
				validationSchema={ProductValidationSchema}
				onSubmit={async (data, { setSubmitting }) => {
					setSubmitting(true);
					const {
						productName: name,
						productPrice: price,
						productDescription: description,
						productCategory,
					} = data;
					const tags = productCategory.filter((tag) => tag !== "others");
					const fileData = data.images[0];
					let imageUri = null;
					if (fileData) {
						const query = gql`
							mutation Mutation($filename: String!, $fileType: String!) {
								signS3(filename: $filename, fileType: $fileType)
							}
						`;
						const variables = {
							filename: generateFilename(fileData.name, fileData.type),
							fileType: fileData.type,
						};
						const { signS3 } = await request(url, query, variables, {
							Authorization: `bearer ${accountReducer.token}`,
						});
						if (signS3) {
							// http request to post image
							try {
								await fetch(signS3, {
									method: "PUT",
									headers: {
										"Content-Type": "multipart/form=data",
									},
									body: fileData,
								});
							} catch (err) {
								console.log("err");
								console.log(err);
							}
							imageUri = signS3.split("?")[0];
						}
					}
					// add product to database or update product
					let query;
					let variables = {};

					if (productId) {
						query = gql`
							mutation UpdateProduct(
								$updateProductId: ID!
								$product: ProductInput!
							) {
								updateProduct(id: $updateProductId, product: $product) {
									status
									message
								}
							}
						`;
						variables = {
							updateProductId: productId,
							product: {
								imageUri,
								name,
								price,
								description,
								tags,
							},
						};
					} else {
						query = gql`
							mutation Mutation($product: ProductInput!) {
								addProduct(product: $product) {
									status
									message
									product {
										name
										description
									}
								}
							}
						`;
						variables = {
							product: {
								imageUri,
								name,
								description,
								price,
								tags,
							},
						};
					}
					// return console.log(variables);
					const returnValue = await request(url, query, variables, {
						Authorization: `bearer ${accountReducer.token}`,
					});

					// console.log(returnValue);
					// const headers = new Headers();
					// // headers.append("Content-Type", "multipart/form-data");
					// headers.append("authorization", `bearer ${accountReducer.token}`);

					// const body = new FormData();
					// // body.append("image", fileData);
					// body.append("productName", data.productName);
					// body.append("productPrice", data.productPrice);
					// body.append("productDescription", data.productDescription);
					// body.append("productCategory", data.productCategory);

					// const uri = "http://localhost:5000/api/product";
					// fetch(uri, {
					// 	method: "POST",
					// 	headers,
					// 	body,
					// }).catch(console.error);

					setSubmitting(false);
					history.push("/account");
				}}
			>
				{({ values, setFieldValue, errors, touched, isSubmitting }) => (
					<Form>
						{/* <Field type="file" name="images" as="input" /> */}
						<pre>{JSON.stringify(values, null, 2)}</pre>
						<div className="imageselector-container">
							<ImageViewer images={values.images} onClose={setFieldValue} />
							<ImagePicker
								name="images"
								values={values.images}
								onChangeField={setFieldValue}
							/>
						</div>
						{/* <ImageSelector
							name="images"
							type="data"
							values={values}
							setFieldValue={setFieldValue}
							error={errors.images}
							touched={touched.images}
						/> */}
						<InputValidation
							placeholder="name"
							type="text"
							name="productName"
						/>
						<div
							className="price-container"
							style={{
								width: 50,
							}}
						>
							<InputValidation
								placeholder="price"
								type="number"
								name="productPrice"
							/>
						</div>
						<Tags
							name="productCategory"
							type="input"
							values={values}
							setFieldValue={setFieldValue}
							error={errors.productCategory}
							touched={touched.productCategory}
						/>
						<TextBoxValidation
							placeholder="description"
							type="text"
							name="productDescription"
						/>
						<div className="button-container">
							<Button type="submit" disabled={isSubmitting}>
								add product
							</Button>
							<Button secondary onClick={history.goBack}>
								cancel
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}

const ImageViewer = ({ images, onClose }) => {
	const cleanedUpImages = images.map((image) => {
		if (typeof image === "object") {
			return URL.createObjectURL(image);
		}
		return image;
	});
	const handleRemove = (index) => {
		const updatedImages = images.filter((_, i) => i != index);
		onClose("images", updatedImages);
	};
	return (
		<div className="imageViewer">
			{cleanedUpImages.map((image, index) => (
				<div>
					{/* <p>{JSON.stringify(image, null, 2)}</p> */}
					<img
						className="image-item"
						width="50px"
						height="100px"
						src={image}
						alt="image not compatible"
					/>
					<button
						className="button"
						type="button"
						onClick={() => handleRemove(index)}
					>
						<CloseIcon sx={{ fontSize: "18px" }} />
						{/* <FontAwesomeIcon icon={faTimes} size="xs" /> */}
					</button>
				</div>
			))}
		</div>
	);
};

const ImagePicker = ({ values, onChangeField }) => {
	// const [field, meta] = useField(props);
	const addImage = useRef();
	const handleFieldChange = (e) => {
		const image = e.target.files[0];
		if (!image) return;
		const newValues = [...values, image];
		onChangeField("images", newValues);
	};
	const handleCleanUp = (e) => {
		console.log("handling");
		const newValues = values.filter((image) => typeof image != undefined);
		onChangeField("images", newValues);
	};
	return (
		<div className="imagePicker-container">
			<div className="image-container" onClick={() => addImage.current.click()}>
				<CameraAltIcon sx={{ fontSize: "32px" }} />
			</div>
			<input
				ref={addImage}
				type="file"
				onChange={(e) => handleFieldChange(e)}
				onBlur={(e) => handleCleanUp(e)}
				style={{ display: "none" }}
			/>
		</div>
	);
};