import React from "react";
import Indicator from "./Indicator";
import "./styles/button/button.css";

export default function Button({
	children,
	secondary,
	onClick,
	style,
	disabled,
	type = "button",
	...others
}) {
	const isSecondary = (secondary) => {
		if (secondary) return "button-secondary";
		return "button-primary";
	};
	return (
		<button
			{...others}
			onClick={onClick}
			disabled={disabled}
			type={type}
			className={`button ${isSecondary(secondary)} ${
				disabled ? "button-disabled" : ""
			} `}
			style={style}
		>
			{/* {disabled && (
				<div className="indicator-container">
					<Indicator />
				</div>
			)} */}
			{children}
		</button>
	);
}
