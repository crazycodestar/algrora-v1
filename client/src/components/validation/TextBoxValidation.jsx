import React from "react";

import "../styles/inputValidation/inputValidation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import { useField } from "formik";
import DescriptionInput from "../DescriptionInput";
import ErrorMessage from "./ErrorMessage";

export default function TextBoxValidation({ ...props }) {
	const [field, meta] = useField(props);
	return (
		<>
			<DescriptionInput {...field} {...props} />
			{meta.touched && meta.error ? <ErrorMessage error={meta.error} /> : null}
		</>
	);
}
