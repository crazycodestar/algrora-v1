import { Check } from "@material-ui/icons";
import request, { gql } from "graphql-request";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import "./styles/confirmEmailScreen/confirmEmailScreen.css";

import image from "../images/undraw_mail_re_duel.svg";
import Input from "../components/Input";

import EmailIcon from "@mui/icons-material/Email";
import Button from "../components/Button";

function useQuery() {
	const { search } = useLocation();

	return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ConfirmEmailScreen({}) {
	const accountReducer = useSelector((state) => state.accountReducer);
	const [value, setValue] = useState("");
	const [userId, setUserId] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isDisabled, setIsDisabled] = useState(false);

	// show button timer
	let queryparmas = useQuery();

	const activateAccount = async (email, id) => {
		const query = gql`
			mutation Register($email: String!, $registerId: String!) {
				register(email: $email, id: $registerId) {
					status
					message
				}
			}
		`;
		const variables = {
			email,
			registerId: id,
		};
		// const { register } = await request("/graphql", query, variables);
		// if (register.status == "failed") {
		// 	setErrorMessage(register.message);
		// }
	};

	useEffect(async () => {
		const email = queryparmas.get("email");
		const id = queryparmas.get("id");

		setUserId(id);
		if (!email) return;

		setValue(email);
		setIsDisabled(true);
		const setDisabled = setTimeout(() => {
			setIsDisabled(false);
		}, 5000);
		await activateAccount(email, id);
		return () => {
			clearTimeout(setDisabled);
		};
	}, []);

	const handleResend = async () => {
		await activateAccount(value, userId);
	};

	return (
		<div className="confirmEmail">
			<div className="mail-container">
				<div className="circle">
					<img src={image} alt="email verification" className="image" />
				</div>
				<h2>email verification sent</h2>
				{value ? <p>an email has been sent to {value}</p> : null}
				<div className="input-details-container">
					<Input
						placeholder="email address"
						Icon={EmailIcon}
						onChange={(e) => setValue(e.target.value)}
						value={value}
						type="email"
						onEnter={handleResend}
					/>
					<Button onClick={handleResend} type="button" disabled={isDisabled}>
						resend mail
					</Button>
				</div>
				{errorMessage ? <p className="message-error">{errorMessage}</p> : null}
			</div>
		</div>
	);
}
