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

import zxcvbn from "zxcvbn";

// graphql
import request, { gql } from "graphql-request";
import { Link } from "react-router-dom";

const SignUpSchema = Yup.object().shape({
	username: Yup.string().min(2).max(15).required(),
	emailAddress: Yup.string().email().required(),
	password: Yup.string().min(8).max(16).required(),
});

export default function SignInScreen() {
	const history = useHistory();
	const dispatch = useDispatch();
	const signIn = (data) => dispatch(login(data));
	const [errorMessage, setErrorMessage] = useState("");

	const handleSignUp = async (values) => {
		const query = gql`
			mutation Mutation(
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
		const { addUser } = await request("/graphql", query, values);
		if (addUser.status == "success") {
			return history.push(
				`/confirmEmail?email=${values.emailAddress}&&id=${addUser.message}`
			);
		}
		setErrorMessage(addUser.message);
	};

	const evaluatePassword = (value) => {
		if (value) {
			const score = zxcvbn(value).score;
			let colour = "";
			let info = "";
			switch (score) {
				case 0:
					info = "very weak";
					colour = "#CC3333";
					break;
				case 1:
					colour = "#CC3333";
					info = "weak";
					break;
				case 2:
					colour = "#FFBF00";
					info = "good";
					break;
				case 3:
					colour = "#4BB543";
					info = "strong";
				default:
					break;
			}
			return (
				<div className="password-score-container">
					<div style={{ height: 5, width: "100%", backgroundColor: "#f3f3f3" }}>
						<div
							style={{
								height: 5,
								width: `${(score / 3) * 100}%`,
								backgroundColor: colour,
							}}
						/>
					</div>
					<p style={{ color: colour }}>{info}</p>
				</div>
			);
		}
	};

	const passwordValidation = (value) => {
		let error;
		const score = zxcvbn(value).score;
		if (score < 2) {
			error = "password too weak";
		}
		return error;
	};

	return (
		<div className="signInScreen-wrapper body-container">
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
					{({ values, errors, isSubmitting }) => (
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
								validate={passwordValidation}
							/>
							{/* <pre>{json}</pre> */}
							{evaluatePassword(values.password)}
							{errorMessage ? (
								<p className="message-error">{errorMessage}</p>
							) : null}
							<div className="button-container">
								<Button secondary onClick={() => history.push("./signIn")}>
									sign in
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									sign up
								</Button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
			<img className="style-image" src={style_image} />
		</div>
	);
}
