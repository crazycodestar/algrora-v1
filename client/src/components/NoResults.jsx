import React from "react";
import image1 from "../images/undraw_empty_re_opql.svg";

export default function NoResults({ style }) {
	return (
		<div className="no-results">
			<img style={style} src={image1} alt="no results" />
			<h4>no results</h4>
		</div>
	);
}
