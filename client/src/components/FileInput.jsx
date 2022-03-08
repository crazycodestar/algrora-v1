import React, { useRef, useState } from "react";

// external components
import { v4 as uuidv4 } from "uuid";

import "./styles/fileInput/fileInput.css";
// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

export default function FileInput({ maxQuantity = 3 }) {
	// input ref
	const fileInput = useRef();
	const [image, setImage] = useState([]);
	const handleChange = (event) => {
		const imageData = event.target.files;
		let imageArray = [];
		for (let i = 0; i < imageData.length; i++) {
			imageArray.push(URL.createObjectURL(imageData[i]));
		}
		setImage([...image, ...imageArray]);
		// setImage(require(`../images/${imageData}`).default);
		// setImage(require(imageData).default);
	};
	const handleDelete = (item) => {
		setImage(image.filter((imageBlob) => imageBlob != item));
	};
	return (
		<div className="fileInput-container">
			{/* <p>this is the file input component</p> */}
			{image.length > 0 &&
				image.map((item) => (
					<div className="image-container" key={uuidv4()}>
						<>
							<div
								className="close-container"
								onClick={() => handleDelete(item)}
							>
								<FontAwesomeIcon icon={faTimesCircle} />
							</div>
							<img src={item} alt="error" style={{ borderRadius: 5 }} />
						</>
					</div>
				))}
			{image.length < maxQuantity && (
				<div
					className="addImage-container"
					onClick={() => fileInput.current.click()}
				>
					<FontAwesomeIcon icon={faCamera} size="2x" />
				</div>
			)}
			<input
				style={{ display: "none" }}
				ref={fileInput}
				type="file"
				onChange={handleChange}
			/>
		</div>
	);
}
