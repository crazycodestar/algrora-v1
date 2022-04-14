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
import { generateFilename, uploadImage } from "../utilityFunctions";
// graphql
import { url } from "../config";
import request, { gql } from "graphql-request";

import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Close } from "@material-ui/icons";

export default function AddProductScreen({ history }) {
	const [activeData, setActiveData] = useState(null);
	const [productId, setProductId] = useState();
	const [errorMessage, setErrorMessage] = useState("");
	const init = useLocation();
	const ProductValidationSchema = Yup.object().shape({
		images: productId ? Yup.array() : Yup.array().min(1).max(3).required(),
		productName: Yup.string().min(3).max(100).required(),
		productPrice: Yup.number().required().positive().integer(),
		productDescription: Yup.string().min(20).max(400).required(),
		productCategory: Yup.array().min(1).required(),
	});
	const initialValues = {
		images: [],
		productName: "",
		productPrice: "",
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
			productPrice: parseInt(params.get("productPrice")),
			productDescription: params.get("productDescription"),
			productCategory: tags,
		};
		console.log("updateParams");
		console.log(updateParams);
		setProductId(params.get("id"));
		setActiveData(updateParams);
	}, []);
	const accountReducer = useSelector((state) => state.accountReducer);
	return (
		<div className="addProduct-container body-container">
			<Formik
				initialValues={activeData || initialValues}
				enableReinitialize
				validationSchema={ProductValidationSchema}
				onSubmit={async (data, { setSubmitting }) => {
					console.log("submitting");
					setSubmitting(true);
					const {
						productName: name,
						productPrice: price,
						productDescription: description,
						productCategory,
					} = data;
					const fileData = data.images[0];
					let imageUri = null;
					console.log("before it");
					if (fileData && typeof fileData !== "string") {
						// console.log();
						const query = gql`
							mutation Mutation($filename: String!, $fileType: String!) {
								signS3(filename: $filename, fileType: $fileType)
							}
						`;
						const variables = {
							// filename: generateFilename(fileData.name, fileData.type),
							filename: fileData.name,
							fileType: fileData.type,
						};
						const { signS3 } = await request(url, query, variables, {
							Authorization: `bearer ${accountReducer.token}`,
						});
						if (signS3) {
							// http request to post image
							try {
								await uploadImage(signS3, fileData);
							} catch (err) {
								console.log("cancelling");
								setErrorMessage(
									"unable to upload due to poor connection try again later"
								);
								setSubmitting(false);
								return;
							}
							imageUri = signS3.split("?")[0];
						}
					}
					console.log("after it");
					// add product to database or update product
					let query;
					let variables = {};

					if (productId) {
						console.log("updating");
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
								tags: productCategory,
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
								tags: productCategory,
							},
						};
					}
					const { addProduct, updateProduct } = await request(
						url,
						query,
						variables,
						{
							Authorization: `bearer ${accountReducer.token}`,
						}
					);

					setSubmitting(false);
					const result = addProduct || updateProduct;
					if (result.status === "success") {
						history.push("/account");
					} else {
						console.log("failed");
						console.log(addProduct);
					}
				}}
			>
				{({ values, setFieldValue, errors, touched, isSubmitting }) => (
					<Form>
						{/* <Field type="file" name="images" as="input" /> */}
						{/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
						<div className="imageselector-container">
							<ImageViewer images={values.images} onClose={setFieldValue} />
							<ImagePicker
								name="images"
								values={values.images}
								onChangeField={setFieldValue}
							/>
						</div>
						{errors.images && touched.images ? (
							<p className="message-error">{errors.images}</p>
						) : null}
						<div className="name-price-container">
							<InputValidation
								placeholder="name"
								type="text"
								name="productName"
							/>
							<InputValidation
								placeholder="price"
								type="number"
								min="0"
								name="productPrice"
							/>
						</div>
						{/* <Tags
							name="productCategory"
							type="input"
							values={values}
							setFieldValue={setFieldValue}
							error={errors.productCategory}
							touched={touched.productCategory}
						/> */}
						<TagPicker
							name="productCategory"
							values={values.productCategory}
							onChange={setFieldValue}
						/>
						<TextBoxValidation
							placeholder="description"
							type="text"
							name="productDescription"
						/>
						<pre>{JSON.stringify(touched, null, 2)}</pre>
						{errorMessage ? (
							<p className="message-error">{errorMessage}</p>
						) : null}
						<div className="button-container">
							<Button type="submit" disabled={isSubmitting}>
								add product
							</Button>
							<Button
								disabled={isSubmitting}
								secondary
								onClick={history.goBack}
							>
								cancel
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}

const TagPicker = ({ name, values, onChange }) => {
	const [categories, setCategories] = useState([]);

	useEffect(async () => {
		const query = gql`
			query Query {
				getCategories {
					id
					name
					description
				}
			}
		`;
		const { getCategories } = await request("/graphql", query);
		setCategories(getCategories);
		return () => {
			setCategories([]);
		};
	}, []);

	const handleClick = (option) => {
		const updatedOptions = [...values, option.id];
		onChange(name, updatedOptions);
	};

	const handleRemove = (option) => {
		const updatedOptions = values.filter((item) => item !== option.id);
		onChange(name, updatedOptions);
	};

	const handleCategories = () => {
		const updatedCategories = categories.filter((item) => {
			const isUsed = values.find((v) => v === item.id);
			if (isUsed) return false;
			return true;
		});
		return (
			<>
				{updatedCategories.map((option) => {
					return (
						<div className="option-wrapper" onClick={() => handleClick(option)}>
							<p>{option.name}</p>
						</div>
					);
				})}
			</>
		);
	};

	return (
		<div className="tagPicker">
			<div className="options">
				{values.length && categories.length
					? values.map((cat) => {
							const option = categories.find((item) => item.id === cat);
							return (
								<div
									className="option-wrapper"
									onClick={() => handleRemove(option)}
									key={option.id}
								>
									<p>{option.name}</p>
									{/* <pre>{JSON.stringify(option, null, 2)}</pre> */}
									{/* <p>place holder</p> */}
									<Close fontSize="small" />
								</div>
							);
					  })
					: null}
			</div>
			<h3>tags</h3>
			<p>select tags that fit your product from the options provided below</p>
			<div className="options">
				{categories.length ? handleCategories() : null}
			</div>
		</div>
	);
};

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
		<>
			{cleanedUpImages.map((image, index) => (
				<div className="imageViewer">
					{/* <p>{JSON.stringify(image, null, 2)}</p> */}
					<div className="image-container">
						<img
							className="image-item"
							width="50px"
							height="100px"
							src={image}
							alt="image not compatible"
						/>
					</div>
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
		</>
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
