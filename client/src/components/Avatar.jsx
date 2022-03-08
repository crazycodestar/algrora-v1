import React from "react";
// styles
import "./styles/avatar/avatar.css";
import accountImage from "../images/undraw_female_avatar_w3jk.svg";

export default function Avatar({ image, styles, name, isActive }) {
	return (
		<div
			className={`avatar-container ${isActive ? "active" : ""}`}
			style={styles}
		>
			{image ? (
				<img className={`avatar `} src={image} alt={name} />
			) : (
				<img src={accountImage} className="avatar" />
			)}
		</div>
	);
}
