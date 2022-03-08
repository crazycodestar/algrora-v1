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
		<div className="signInScreen-wrapper">
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
						username: "seriousfaceman",
						username: "Olalekan",
						username: "rober",
						password: "seriouslyfacing.",
						password: "lekanisboss",
						password: "koblerwer",
					}}
					validationSchema={SignInSchema}
					onSubmit={(data, { setSubmitting }) => {
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
								}
							}
						`;
						request("/graphql", query, data).then((res) => {
							if (res.login.status == "failed") return console.log(res);
							signIn({
								token: res.login.message,
								userData: res.login.user,
							});
							localStorage.setItem("token", JSON.stringify(res.login.message));
							localStorage.setItem("userData", JSON.stringify(res.login.user));
							history.push("/");
						});
						setSubmitting(false);
					}}
				>
					{({ values, isSubmitting }) => (
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
