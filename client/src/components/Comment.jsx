import React, { useEffect } from "react";
import { formatTime } from "../utilityFunctions";

import "./styles/comment/comment.css";

export default function Comment({ comment }) {
	const { user, comment: content, uploadTime } = comment;
	return (
		<div className="comment-container">
			<img src={user.imageUri} alt={user.username} className="accountImage" />
			<div className="details-container">
				<div>
					<p className="account-name">{user.username}</p>
					<p className="timeOfUpload">{formatTime(uploadTime)}</p>
				</div>
				<div className="body">{content}</div>
			</div>
		</div>
	);
}
