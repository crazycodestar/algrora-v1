import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTimes,
	faCamera,
	faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FieldArray } from "formik";

//css
import "./styles/imageSelector/imageSelector.css";

//components
import Button from "./Button";

export default function ImageSelector({
	touched,
	error,
	name,
	values,
	setFieldValue,
}) {
	const [imageArray, setImageArray] = useState([]);
	return (
		<>
			<FieldArray name={name}>
				{({ insert, remove, push }) => (
					<div className="image-selector">
						{/* <pre>{JSON.stringify(imageArray, null, 2)}</pre> */}

						{values[name].length > 0 &&
							values[name].map((image, index) => {
								const handleChange = (event) => {
									// event.preventDefault();
									const imageData = event.target.files[0];
									const imageObject = {
										id: index,
										imageBlobData: URL.createObjectURL(imageData),
									};

									setFieldValue(`${name}.${index}`, imageData);
									setImageArray([...imageArray, imageObject]);
								};
								const handleImageDisplay = () => {
									// return URL.createObjectURL(image.target.files[0]);
									const imageData = imageArray.find(
										(imageBlob) => imageBlob.id === index
									);
									if (typeof imageData !== "undefined") {
										return imageData.imageBlobData;
									}
								};

								const handleRemove = (index) => {
									const newImageArray = [];
									for (let i = 0; i < imageArray.length; i++) {
										if (imageArray[i].id < index) {
											newImageArray.push(imageArray[i]);
										} else if (imageArray[i].id > index) {
											newImageArray.push({
												id: i - 1,
												imageBlobData: imageArray[i].imageBlobData,
											});
										}
									}
									setImageArray(newImageArray);
									remove(index);
								};
								return (
									<div className="data-container" key={index}>
										{/* <pre>{index}</pre> */}
										<ImageCard
											image={handleImageDisplay()}
											onChange={(e) => handleChange(e)}
											onRemove={() => handleRemove(index)}
										/>
									</div>
								);
							})}
						{imageArray.length < 3 && (
							<button
								type="button"
								className="add-image-button"
								onClick={() => push()}
							>
								<FontAwesomeIcon icon={faCamera} size="2x" />
							</button>
						)}
					</div>
				)}
			</FieldArray>
			{error && touched ? (
				<p className="message-error">
					<FontAwesomeIcon
						style={{ marginRight: 5 }}
						icon={faExclamationCircle}
					/>
					{error}
				</p>
			) : null}
		</>
	);
}

const ImageCard = ({ image, onChange, onRemove }) => {
	const fileInputRef = useRef();
	const [display, setDisplay] = useState(false);
	useEffect(() => {
		fileInputRef.current.click();
	}, []);
	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				style={{ display: "none" }}
				onChange={(e) => {
					setDisplay(true);
					onChange(e);
				}}
			/>
			{display ? (
				<img
					className="image-item"
					width="50px"
					height="100px"
					src={image}
					alt="image not compatible"
				/>
			) : (
				<div
					className="placeholder-image"
					onClick={() => fileInputRef.current.click()}
				/>
			)}
			<button className="button" onClick={onRemove}>
				<FontAwesomeIcon icon={faTimes} size="xs" />
			</button>
		</>
	);
};
