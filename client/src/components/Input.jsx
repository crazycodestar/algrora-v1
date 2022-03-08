import React, { useRef, useEffect } from "react";
import "./styles/input/input.css";

export default function Input({
	style,
	placeholder,
	triggerFocus,
	onChange,
	value,
	type = "text",
	onEnter,
	focusMonitor,
	Icon,
	...others
}) {
	const input = useRef();
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
	return (
		<div className="input-container">
			<div className="container">{Icon && <Icon sx={{ fontSize: 18 }} />}</div>
			<input
				style={style}
				ref={input}
				type={type}
				onChange={onChange}
				onSubmit={onEnter}
				value={value}
				className="input"
				placeholder={placeholder}
				{...others}
				onKeyDown={(e) => {
					if (e.key === "Enter" && onEnter) onEnter();
				}}
			/>
		</div>
	);
}
