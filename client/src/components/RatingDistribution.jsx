import React, { useEffect } from "react";

import "./styles/ratingDistribution/ratingDistribution.css";

export default function RatingDistribution({ ratingDistribution }) {
	const totalRating = ratingDistribution.reduce(
		(a, b) => a.value || a + b.value
	);
	return (
		<div className="ratingDistribution-container">
			<p className="header">rating distribution</p>
			<div className="totalRating-wrapper">
				<p className="totalRating">3.5</p>
			</div>
			<div className="individual-rating-container">
				{ratingDistribution.map((item) => (
					<Rating rating={item} totalRating={totalRating} />
				))}
			</div>
		</div>
	);
}

const Rating = ({ rating, totalRating }) => {
	return (
		<div className="rating-wrapper">
			<div className="text-container">
				<p>{rating.name}</p>
				<p>({rating.noOfReviews})</p>
			</div>
			<div className="rating-container">
				<div
					className="rating-value"
					style={{ flex: `${rating.value / totalRating}` }}
				/>
			</div>
		</div>
	);
};
