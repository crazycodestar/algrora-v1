import React, { useState } from "react";
// style
import "./styles/signInScreen/signInScreen.css";
import LinkIcon from "@mui/icons-material/Link";
import style_image from "../images/undraw_access_account_re_8spm.svg";
// component
import Input from "../components/Input";
import Button from "../components/Button";
import InputValidation from "../components/validation/InputValidation";
// redux
import { useDispatch } from "react-redux";
import { login } from "../actions/account";
// dev components
import { useHistory } from "react-router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import request, { gql } from "graphql-request";
import { Link } from "react-router-dom";

const SignInSchema = Yup.object().shape({
	username: Yup.string().min(2).max(50).required(),
	password: Yup.string().min(8).max(16).required(),
});
const SignUpSchema = Yup.object().shape({
	username: Yup.string().min(2).max(50).required(),
	emailAddress: Yup.string().email().required(),
	password: Yup.string().min(8).max(16).required(),
});

export default function SignInScreen() {
	const [errorMessage, setErrorMessage] = useState("");
	const history = useHistory();
	const dispatch = useDispatch();
	const storeDispatch = useDispatch();
	const signIn = (data) => dispatch(login(data));
	return (
		<div className="signInScreen-wrapper body-container">
			<div className="sign-section">
				<h1>sign in</h1>
				<Link to="/">
					<div className="proceedWithoutSigning">
						<p>proceed without signing in</p>
						<LinkIcon sx={{ fontSize: 18 }} color="primary" />
					</div>
				</Link>
				<Formik
					initialValues={{
						username: "rober",
						password: "koblerwer",
					}}
					validationSchema={SignInSchema}
					onSubmit={async (data, { setSubmitting }) => {
						setSubmitting(true);
						const query = gql`
							mutation Login($username: String!, $password: String!) {
								login(username: $username, password: $password) {
									status
									message
									user {
										id
										imageUri
										emailAddress
										username
										store
									}
									isInterest
								}
							}
						`;

						const { login } = await request("/graphql", query, data);
						if (login.status === "success") {
							signIn({
								token: login.message,
								userData: { ...login.user, interests: undefined },
							});
							console.log(login.user);
							console.log("after logging");
							if (!login.isInterest) {
								console.log("if statement");
								return history.push("/category");
							}
							history.push("/");
						}
						if (login.status === "unactivated") {
							console.log(login);
							history.push(`/confirmEmail?id=${login.user.id}`);
						}
						setSubmitting(false);
						setErrorMessage(login.message);
					}}
				>
					{({ isSubmitting }) => (
						<Form className="form-container">
							<InputValidation
								name="username"
								type="text"
								placeholder="username of email Address"
								triggerFocus
							/>
							<InputValidation
								name="password"
								type="password"
								placeholder="password"
							/>
							{errorMessage ? (
								<p className="message-error">{errorMessage}</p>
							) : null}
							<div className="button-container">
								<Button secondary onClick={() => history.push("/signUp")}>
									sign up
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									sign in
								</Button>
							</div>
							{/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
						</Form>
					)}
				</Formik>
			</div>
			<img className="style-image" src={style_image} />
		</div>
	);
}
