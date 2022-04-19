import React, { useRef, useEffect, useState } from "react";
import "./styles/input/input.css";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
	label,
	...others
}) {
	const [passwordVisible, setPasswordVisible] = useState(false);
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
			{label && <p>{label}</p>}
			<div className="sub-container">
				<div className="container">
					{Icon && <Icon sx={{ fontSize: 18 }} />}
				</div>
				<input
					style={style}
					ref={input}
					type={type === "password" && passwordVisible ? "text" : type}
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
				{type === "password" ? (
					<div
						className="password-container"
						onClick={() => setPasswordVisible(!passwordVisible)}
					>
						{passwordVisible ? (
							<VisibilityOffIcon sx={{ fontSize: 18 }} />
						) : (
							<VisibilityIcon sx={{ fontSize: 18 }} />
						)}
					</div>
				) : null}
			</div>
		</div>
	);
}
