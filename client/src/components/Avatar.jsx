import React from "react";
// styles
import "./styles/avatar/avatar.css";
import accountImage from "../images/undraw_female_avatar_w3jk.svg";

export default function Avatar({ image, styles, name, isActive, onClick }) {
	return (
		<div onClick={onClick} className={`avatar-container`} style={styles}>
			<div className={`wrapper ${isActive ? "active" : ""}`}>
				{image ? (
					<img className={`avatar`} src={image} alt={name} />
				) : (
					<img src={accountImage} className="avatar" />
				)}
			</div>
		</div>
	);
}
