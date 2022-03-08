import React from "react";

import NavigationBar from "../components/NavigationBar";
import SideNavigationBar from "../components/SideNavigationBar";

export default function AdministrativePanel() {
	return (
		<div
			style={{
				display: "flex",
				width: "100%",
				backgroundColor: "red",
				justifyContent: "space-between",
			}}
		>
			<SideNavigationBar />
			<div>
				<NavigationBar />
			</div>
		</div>
	);
}
