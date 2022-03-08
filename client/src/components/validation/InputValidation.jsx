import React from "react";

import "../styles/inputValidation/inputValidation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import { useField } from "formik";
import Input from "../Input";
import ErrorMessage from "./ErrorMessage";

export default function InputValidation({ ...props }) {
	const [field, meta] = useField(props);
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
			<Input {...field} {...props} />
			{meta.touched && meta.error ? <ErrorMessage error={meta.error} /> : null}
		</div>
	);
}
