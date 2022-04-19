import React, { useRef } from "react";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";

export default function ImagePicker({ values, onChangeField }) {
	const addImage = useRef();
	const handleFieldChange = (e) => {
		const image = e.target.files[0];
		if (!image) return;
		const newValues = [...values, image];
		onChangeField("images", newValues);
	};
	const handleCleanUp = (e) => {
		console.log("handling");
		const newValues = values.filter((image) => typeof image != undefined);
		onChangeField("images", newValues);
	};
	return (
		<div className="imagePicker-container">
			<div className="image-container" onClick={() => addImage.current.click()}>
				<CameraAltIcon sx={{ fontSize: "32px" }} />
			</div>
			<input
				ref={addImage}
				type="file"
				onChange={(e) => handleFieldChange(e)}
				onBlur={(e) => handleCleanUp(e)}
				style={{ display: "none" }}
			/>
		</div>
	);
}

export const ImageViewer = ({ images, onClose }) => {
	// return <pre>{console.log(images)}</pre>;
	const cleanedUpImages = images.map((image) => {
		if (!image) return;
		if (typeof image === "object") {
			return URL.createObjectURL(image);
		}
		return image;
	});
	const handleRemove = (index) => {
		const updatedImages = images.filter((_, i) => i != index);
		onClose("images", updatedImages);
	};
	return (
		<>
			{cleanedUpImages.map((image, index) => (
				<div className="imageViewer">
					{/* <p>{JSON.stringify(image, null, 2)}</p> */}
					<div className="image-container">
						<img
							className="image-item"
							width="50px"
							height="100px"
							src={image}
							alt="image not compatible"
						/>
					</div>
					<button
						className="button"
						type="button"
						onClick={() => handleRemove(index)}
					>
						<CloseIcon sx={{ fontSize: "18px" }} />
						{/* <FontAwesomeIcon icon={faTimes} size="xs" /> */}
					</button>
				</div>
			))}
		</>
	);
};
