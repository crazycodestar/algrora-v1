import React, { useState } from "react";
// style
import "./styles/signInScreen/signInScreen.css";
import LinkIcon from "@mui/icons-material/Link";
import style_image from "../images/undraw_press_play_re_85bj.svg";
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

// graphql
import request, { gql } from "graphql-request";
import { Link } from "react-router-dom";

const SignUpSchema = Yup.object().shape({
	username: Yup.string().min(2).max(50).required(),
	emailAddress: Yup.string().email().required(),
	password: Yup.string().min(8).max(16).required(),
});

export default function SignInScreen() {
	const history = useHistory();
	const dispatch = useDispatch();
	const signIn = (data) => dispatch(login(data));

	const handleSignUp = (values) => {
		const query = gql`
			mutation AddUser(
				$username: String!
				$emailAddress: String!
				$password: String!
			) {
				addUser(
					username: $username
					emailAddress: $emailAddress
					password: $password
				) {
					status
					message
					user {
						username
						emailAddress
						store
					}
				}
			}
		`;
		// const data = await client(query, values);
		request("/graphql", query, values).then((res) => {
			if (res.status == "failed") return console.log(res);
			signIn({ token: res.addUser.message, userData: res.addUser.user });
			localStorage.setItem("token", JSON.stringify(res.addUser.message));
			localStorage.setItem("userData", JSON.stringify(res.addUser.user));
			history.push("/");
		});
	};

	return (
		<div className="signInScreen-wrapper">
			<div className="sign-section">
				<h1>sign up</h1>
				<Link to="/">
					<div className="proceedWithoutSigning">
						<p>proceed without signing in</p>
						<LinkIcon sx={{ fontSize: 18 }} color="primary" />
					</div>
				</Link>
				<Formik
					initialValues={{
						username: "",
						emailAddress: "",
						password: "",
					}}
					validationSchema={SignUpSchema}
					onSubmit={async (values) => {
						handleSignUp(values);
					}}
				>
					{({ values, error, isSubmitting }) => (
						<Form className="form-container">
							<InputValidation
								name="username"
								type="text"
								placeholder="username"
								triggerFocus
							/>
							<InputValidation
								name="emailAddress"
								type="email"
								placeholder="email address"
							/>
							<InputValidation
								name="password"
								type="password"
								placeholder="password"
							/>
							<div className="button-container">
								<Button secondary onClick={() => history.push("./signIn")}>
									sign in
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									sign up
								</Button>
							</div>
							{/* <pre>{JSON.stringify(values, null, 2)}</pre>
							<pre>{JSON.stringify(error, null, 2)}</pre> */}
						</Form>
					)}
				</Formik>
			</div>
			<img className="style-image" src={style_image} />
		</div>
	);
}
