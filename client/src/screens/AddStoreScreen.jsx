import React, { useState, useEffect, useRef } from "react";

// css
import "./styles/addProductScreen/addProductScreen.css";

// components
import Button from "../components/Button";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import InputValidation from "../components/validation/InputValidation";
import TextBoxValidation from "../components/validation/TextBoxValidation";
import ImageSelector from "../components/ImageSelector";
// utilities
import { generateFilename } from "../utilityFunctions";

// redux
import { useSelector, useDispatch } from "react-redux";
import { update } from "../actions/account";

import { useLocation } from "react-router-dom";
import { uploadImage } from "../utilityFunctions";

import { createStore } from "../actions/store";

// graphql
import { url } from "../config";
import request, { gql } from "graphql-request";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";

export default function AddStoreScreen({ history }) {
	const [activeData, setActiveData] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [storeId, setStoreId] = useState("");
	const init = useLocation();
	const storeValidationSchema = Yup.object().shape({
		images: storeId ? Yup.array() : Yup.array().min(1).required(),
		storeName: Yup.string().min(3).max(255).required(),
		storeDescription: Yup.string().min(20).max(400).required(),
		// productCategory: Yup.string().min()
	});
	const initialValues = {
		images: [],
		storeName: "",
		storeDescription: "",
	};
	useEffect(() => {
		const params = new URLSearchParams(init.search);
		if (!params.get("id")) return;
		const images = JSON.parse(params.get("images"));
		const updateParams = {
			images,
			storeName: params.get("storeName"),
			storeDescription: params.get("storeDescription"),
		};
		setStoreId(params.get("id"));
		setActiveData(updateParams);
	}, []);
	const accountReducer = useSelector((state) => state.accountReducer);
	const dispatch = useDispatch();
	const makeStore = (data) => dispatch(createStore(data));
	const updateAccount = (data) => dispatch(update(data));
	return (
		<div className="addProduct-container body-container">
			<Formik
				initialValues={activeData || initialValues}
				enableReinitialize
				validationSchema={storeValidationSchema}
				onSubmit={async (data, { setSubmitting }) => {
					setSubmitting(true);
					const fileData = data.images[0];
					let imageUri = null;
					if (fileData) {
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
					// add store to database or updateStore
					let query;
					let variables = {};

					if (storeId) {
						query = gql`
							mutation UpdateStore($updateStoreId: ID!, $store: StoreInput!) {
								updateStore(id: $updateStoreId, store: $store) {
									status
									message
								}
							}
						`;
						variables = {
							updateStoreId: storeId,
							store: {
								name: data.storeName,
								description: data.storeDescription,
								imageUri: imageUri,
							},
						};
					} else {
						query = gql`
							mutation Mutation(
								$name: String!
								$description: String!
								$imageUri: String
							) {
								addStore(
									name: $name
									description: $description
									imageUri: $imageUri
								) {
									status
									message
								}
							}
						`;
						variables = {
							name: data.storeName,
							description: data.storeDescription,
							imageUri: imageUri,
						};
					}

					const returnValue = await request(url, query, variables, {
						Authorization: `bearer ${accountReducer.token}`,
					});

					const details = returnValue.addStore || returnValue.updateStxore;
					if (details.status === "success" && !storeId) {
						updateAccount({ store: details.message });
					}
					setSubmitting(false);
					history.push("/pricing");
				}}
			>
				{({ values, setFieldValue, errors, touched, isSubmitting }) => (
					<Form>
						{/* <Field type="file" name="images" as="input" /> */}
						{/* <pre>{JSON.stringify(storeId, null, 2)}</pre>
						<pre>{JSON.stringify(activeData, null, 2)}</pre> */}
						<div className="imageselector-container">
							<ImageViewer images={values.images} onClose={setFieldValue} />
							<ImagePicker
								name="images"
								values={values.images}
								onChangeField={setFieldValue}
							/>
						</div>
						<InputValidation placeholder="name" type="text" name="storeName" />
						<TextBoxValidation
							placeholder="description"
							type="text"
							name="storeDescription"
						/>

						{/* <pre>{JSON.stringify(values, null, 2)}</pre>
						<pre>{JSON.stringify(errors, null, 2)}</pre> */}
						{errorMessage ? (
							<p className="message-error">{errorMessage}</p>
						) : null}
						<div className="button-container">
							<Button disabled={isSubmitting} type="submit">
								add store
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
