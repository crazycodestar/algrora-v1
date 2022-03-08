import React from "react";

import "../styles/inputValidation/inputValidation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import { useField } from "formik";
import DescriptionInput from "../DescriptionInput";

export default function TextBoxValidation({ ...props }) {
	const [field, meta] = useField(props);
	return (
		<>
			<DescriptionInput {...field} {...props} />
			{meta.touched && meta.error ? (
				<div className="error">
					<p className="message-error">
						<FontAwesomeIcon
							style={{ marginRight: 5 }}
							icon={faExclamationCircle}
						/>
						{meta.error}
					</p>
				</div>
			) : null}
		</>
	);
}
