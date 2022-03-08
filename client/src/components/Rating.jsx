import React, { useEffect, useState } from "react";
import { faStamp, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Rating({ rating }) {
	const [ratingComponent, setRatingComponent] = useState();
	useEffect(() => {
		let ratingComponent = [];
		const isHalfStar = rating % 1;
		const noOfFullStars = rating - (rating % 1);
		for (let i = 0; i < noOfFullStars; i++) {
			ratingComponent.push(<FontAwesomeIcon icon={faStar} color="gold" />);
		}
		if (isHalfStar) {
			ratingComponent.push(
				<FontAwesomeIcon icon={faStarHalfAlt} color="gold" />
			);
			for (let i = 0; i < 4 - noOfFullStars; i++) {
				ratingComponent.push(<FontAwesomeIcon icon={faStar} />);
			}
		} else {
			for (let i = 0; i < 5 - noOfFullStars; i++) {
				console.log("here");
				ratingComponent.push(<FontAwesomeIcon icon={faStar} />);
			}
		}
		setRatingComponent(ratingComponent);
	}, []);
	return <div style={{ marginTop: 10 }}>{ratingComponent}</div>;
}
