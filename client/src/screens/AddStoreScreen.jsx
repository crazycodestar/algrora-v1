import React, { useState, useEffect } from "react";

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

// graphql
import { url } from "../config";
import request, { gql } from "graphql-request";

export default function AddStoreScreen({ history }) {
	const [activeData, setActiveData] = useState(null);
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
		const updateParams = {
			images: [],
			storeName: params.get("storeName"),
			storeDescription: params.get("storeDescription"),
		};
		setStoreId(params.get("id"));
		setActiveData(updateParams);
	}, []);
	const accountReducer = useSelector((state) => state.accountReducer);
	const dispatch = useDispatch();
	const updateAccount = (data) => dispatch(update(data));
	return (
		<div className="addProduct-container">
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

					const details = returnValue.addStore || returnValue.updateStore;

					if (returnValue.status === "success" && !storeId) {
						const newState = { ...accountReducer };
						newState.userData.store = returnValue.message;
						updateAccount(newState);
					}
					setSubmitting(false);
					history.push("/account");
				}}
			>
				{({ values, setFieldValue, errors, touched, isSubmitting }) => (
					<Form>
						{/* <Field type="file" name="images" as="input" /> */}
						<pre>{JSON.stringify(storeId, null, 2)}</pre>
						<pre>{JSON.stringify(activeData, null, 2)}</pre>
						<ImageSelector
							name="images"
							type="data"
							values={values}
							setFieldValue={setFieldValue}
							error={errors.images}
							touched={touched.images}
						/>
						<InputValidation placeholder="name" type="text" name="storeName" />
						<TextBoxValidation
							placeholder="description"
							type="text"
							name="storeDescription"
						/>

						<pre>{JSON.stringify(values, null, 2)}</pre>
						<pre>{JSON.stringify(errors, null, 2)}</pre>
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
