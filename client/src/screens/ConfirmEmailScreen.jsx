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
	const [value, setValue] = useState("");
	const [userId, setUserId] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isDisabled, setIsDisabled] = useState(false);
	const [isSent, setSent] = useState(false);
	const [blocked, setBlocked] = useState(false);

	// show button timer
	let queryparmas = useQuery();

	useEffect(() => {
		console.log("functioning");
		let timer;
		if (!blocked) {
			timer = setTimeout(() => {
				setIsDisabled(false);
			}, 5000);
		}
		return clearTimeout(timer);
	}, [isDisabled]);

	const activateAccount = async (email, id) => {
		console.log("working");
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
		const { register } = await request("/graphql", query, variables);
		console.log(register);
		if (register.status == "failed") {
			setErrorMessage(register.message);
		}

		if (register.status == "activated") {
			setErrorMessage(register.message);
			setIsDisabled(false);
			setBlocked(true);
		}
	};

	useEffect(async () => {
		const email = queryparmas.get("email");
		const id = queryparmas.get("id");

		setUserId(id);
		if (!email) return;

		setSent(true);
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
		setSent(true);
		setIsDisabled(true);
	};

	return (
		<div className="confirmEmail">
			<div className="mail-container">
				<div className="circle">
					<img src={image} alt="email verification" className="image" />
				</div>
				<h2>email verification sent</h2>
				<p className="warning">
					please if you do not see an email from{" "}
					<i>altechbusinesses@gmail.com</i> please look through your spam mail
				</p>
				{value && isSent ? <p>an email has been sent to {value}</p> : null}
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
