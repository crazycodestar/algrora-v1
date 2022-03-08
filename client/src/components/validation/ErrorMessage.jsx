import React from "react";
// styles
import "../styles/errorMessage/errorMessage.css";
import ErrorIcon from "@mui/icons-material/Error";

export default function ErrorMessage({ error }) {
	return (
		<div className="error">
			<ErrorIcon sx={{ fontSize: 18 }} />
			<p className="message">{error}</p>
		</div>
	);
}
