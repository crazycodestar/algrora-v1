import React, { useState, useRef, useEffect } from "react";

// css
import "./styles/input/input.css";
import "./styles/descriptionInput/descriptionInput.css";

export default function DescriptionInput({
	rows = 5,
	style,
	placeholder,
	triggerFocus,
	onChange,
	Icon,
	value,
	type = "text",
	onEnter,
	label,
	focusMonitor,
	...others
}) {
	const input = useRef();
	const [height, setHeight] = useState();
	useEffect(() => {
		if (triggerFocus) {
			input.current.focus();
		}
		if (focusMonitor) {
			input.current.focus();
		}
	}, [focusMonitor]);
	// const handleSelected = (e) => {
	// 	if (typeof setSelected !== "undefined") {
	// 		if (e) {
	// 			setSelected(true);
	// 		} else {
	// 			setSelected(false);
	// 		}
	// 	}
	// };
	const handleInputChange = (e) => {
		// input.current.style.height = `${input.current.scrollHeight}px`;
		// console.log("here");
		// console.log(input.current.scrollHeight);
		// setHeight(input.current.scrollHeight);
		onChange(e);
	};
	return (
		<div className="input-container">
			{label && <p>{label}</p>}
			<div className="sub-container">
				<div className="container">
					{Icon && <Icon sx={{ fontSize: 18 }} />}
				</div>
				<textarea
					ref={input}
					rows={rows}
					style={style}
					type={type}
					onChange={handleInputChange}
					value={value}
					className="input"
					placeholder={placeholder}
					{...others}
					onKeyDown={(e) => {
						if (e.key === "Enter" && onEnter) onEnter();
					}}
				/>
			</div>
		</div>
	);
}
