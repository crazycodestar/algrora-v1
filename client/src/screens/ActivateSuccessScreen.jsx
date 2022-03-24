import React from "react";

import "./styles/activateSuccessScreen/activateSuccessScreen.css";

import image from "../images/undraw_email_campaign_re_m6k5.svg";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";

export default function ActivateSuccessScreen() {
	const history = useHistory();
	return (
		<div className="activateSuccess">
			<div className="container">
				<div className="circle">
					<img src={image} alt="email verification" className="image" />
				</div>
				<h2>activation successful</h2>

				<Button onClick={() => history.push("/login")} type="button">
					login
				</Button>
			</div>
		</div>
	);
}
