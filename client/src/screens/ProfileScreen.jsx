import request, { gql } from "graphql-request";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../components/Input";
import TextBoxValidation from "../components/validation/TextBoxValidation";
import { header } from "../config";

import "./styles/profileScreen/profileScreen.css";

import BadgeIcon from "@mui/icons-material/Badge";
import ErrorIcon from "@mui/icons-material/Error";

import { Form, Formik } from "formik";
import InputValidation from "../components/validation/InputValidation";
import TagPicker from "../components/TagPicker";
import ErrorMessage from "../components/validation/ErrorMessage";
import Button from "../components/Button";

import useUser from "../hooks/useQuery/useUser";
import ImagePicker, { ImageViewer } from "../components/ImageUtils";
import { storeValidationSchema, userValidationSchema } from "../validation";
import ActivityIndicator from "../components/ActivityIndicator";

export default function ProfileScreen() {
	const { token } = useSelector((state) => state.accountReducer);
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [userData, setUserData] = useState({});
	const [storeData, setStoreData] = useState({});

	const { images, username, emailAddress } = userData;
	const { imageUri: storeImage, name: storeName } = storeData;

	const { updateProfile } = useUser();

	useEffect(async () => {
		const query = gql`
			query User {
				user {
					imageUri
					username
					emailAddress
					store
					tel
					roomAddress
					interests {
						id
						name
					}
				}
			}
		`;

		const { user } = await request("/graphql", query, {}, header(token));
		user.interests = user.interests.map((int) => int.id);
		user.images = user.imageUri ? [user.imageUri] : [];
		setUserData(user);
		setLoading(false);
		// if (user.store) {
		// 	const query = gql`
		// 		query Query($getStoreId: ID!) {
		// 			getStore(id: $getStoreId) {
		// 				status
		// 				store {
		// 					name
		// 					imageUri
		// 					description
		// 				}
		// 			}
		// 		}
		// 	`;

		// 	const variables = {
		// 		getStoreId: user.store,
		// 	};

		// 	const { getStore } = await request("/graphql", query, variables);
		// 	if (getStore.status === "success") {
		// 		setStoreData({ ...getStore.store, images: [getStore.store.imageUri] });
		// 	}
		// }
	}, []);

	if (isLoading)
		return (
			<div className="empty-container body-container">
				<ActivityIndicator />
			</div>
		);

	return (
		<div className="profileScreen body-container">
			<Formik
				initialValues={userData}
				validationSchema={userValidationSchema}
				enableReinitialize
				onSubmit={async (values, { setSubmitting }) => {
					console.log(values);
					try {
						await updateProfile({ ...values, tags: values.interests });
					} catch (err) {
						setError(err);
					}
					setSubmitting(false);
				}}
			>
				{({ values, setFieldValue, errors, isSubmitting, resetForm }) => {
					// const imagesLen = values.images.filter((img) => img !== null).length;
					const imagesLen = values.images.length;
					if (values && Object.entries(values).length)
						return (
							<Form>
								<h3>my profile</h3>
								<div className="user-profile-container">
									<div className="image-container">
										{/* <img src={storeImage} alt={username} /> */}
										{imagesLen ? (
											<ImageViewer
												images={values.images}
												onClose={setFieldValue}
											/>
										) : null}
										{!imagesLen && (
											<ImagePicker
												name="images"
												values={values.images}
												onChangeField={setFieldValue}
											/>
										)}
									</div>
									<div className="profile-body">
										<InputValidation
											type="text"
											name="username"
											placeholder={username}
											Icon={BadgeIcon}
											label="username"
										/>
										<p className="email-address">{emailAddress}</p>
										<TagPicker
											name="interests"
											values={values.interests}
											onChange={setFieldValue}
										/>
										<div className="delivery-details-container">
											<h2>delivery details</h2>
											<ErrorMessage
												error="These details will be provide to the store to help them
										reach you"
											/>
											<InputValidation
												type="text"
												name="roomAddress"
												label="room address"
											/>
											<InputValidation
												name="tel"
												type="text"
												label="phone no"
											/>
										</div>
										{error && <ErrorMessage error={error} />}
										<button className="button-container">
											<Button
												secondary
												type="reset"
												disabled={isSubmitting}
												onClick={resetForm}
											>
												reset
											</Button>
											<Button type="submit" disabled={isSubmitting}>
												save
											</Button>
										</button>
									</div>
								</div>
							</Form>
						);
				}}
			</Formik>
		</div>
	);
}

// potential store edit
// {storeData && (
// 	<Formik
// 		initialValues={storeData}
// 		validationSchema={storeValidationSchema}
// 		enableReinitialize
// 		onSubmit={(values, { setSubmitting }) => {
// 			console.log(values);
// 			setSubmitting(false);
// 		}}
// 	>
// 		{({ values, isSubmitting, setFieldValue, resetForm }) => {
// 			if (Object.entries(values).length)
// 				return (
// 					<Form>
// 						<h3>store</h3>
// 						<div className="store-profile-container">
// 							<div className="image-container">
// 								{/* <img src={storeImage} alt={username} /> */}
// 								<ImageViewer
// 									images={values.images}
// 									onClose={setFieldValue}
// 								/>
// 								{!values.images.length && (
// 									<ImagePicker
// 										name="images"
// 										values={values.images}
// 										onChangeField={setFieldValue}
// 									/>
// 								)}
// 							</div>
// 							<div className="profile-body">
// 								<InputValidation
// 									type="text"
// 									name="name"
// 									placeholder={storeName}
// 									Icon={BadgeIcon}
// 									label="store name"
// 								/>
// 								{/* <TagPicker
// 							name="categories"
// 							values={values.categories}
// 							onChange={setFieldValue}
// 						/> */}
// 								<TextBoxValidation
// 									label="description"
// 									name="description"
// 									type="text"
// 									placeholder="description"
// 								/>
// 								<button className="container">
// 									<Button
// 										secondary
// 										type="button"
// 										disabled={isSubmitting}
// 										onClick={resetForm}
// 									>
// 										reset
// 									</Button>
// 									<Button type="submit" disabled={isSubmitting}>
// 										save
// 									</Button>
// 								</button>
// 							</div>
// 						</div>
// 					</Form>
// 				);
// 		}}
// 	</Formik>
// )}
