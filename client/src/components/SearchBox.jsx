import React from "react";

import "./styles/searchBox/searchBox.css";

export default function SearchBox({ placeholder = "search here" }) {
	return (
		<div className="searchBox-container">
			<input type="text" className="input" placeholder={placeholder} />
		</div>
	);
}
