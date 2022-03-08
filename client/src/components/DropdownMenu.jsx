import React, { useState, useRef, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import "./styles/DropdownMenu/dropdownMenu.css";

import { v4 as uuidv4 } from "uuid";

export default function DropdownMenu({ options, onOption, disabled = false }) {
	const [showOptions, setShowOptions] = useState(false);
	const container = useRef();

	useEffect(() => {
		document.addEventListener("mouseup", handleClickOutside);

		return () => {
			document.removeEventListener("mouseup", handleClickOutside);
		};
	}, []);

	const handleClickOutside = (event) => {
		if (container.current && !container.current.contains(event.target)) {
			setShowOptions(false);
		}
	};

	return (
		<button
			className="dropdownMenu-container"
			style={{
				display: disabled ? "none" : "block",
			}}
			onClick={() => setShowOptions(!showOptions)}
			ref={container}
		>
			<FontAwesomeIcon icon={faEllipsisV} size="lg" />
			{showOptions && (
				<ul className="options-container">
					{options.map((option) => (
						<li
							key={uuidv4()}
							className="options"
							style={{
								listStyle: "none",
								color: option.type === "danger" ? "tomato" : "",
							}}
							onClick={() => onOption(option.name)}
						>
							{option.name}
						</li>
					))}
				</ul>
			)}
		</button>
	);
}
