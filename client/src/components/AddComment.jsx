import React from "react";
//css
import "./styles/addComment/addComment.css";
// components
import DescriptionInput from "./DescriptionInput";
import Button from "./Button";
// redux
import { useSelector } from "react-redux";

export default function Comment({ commentValue, onComment, onPost }) {
	const { userData } = useSelector((state) => state.accountReducer);
	return (
		<div className="addComment">
			{userData.imageUri ? (
				<img
					src={userData.imageUri}
					alt={userData.username}
					className="accountImage"
				/>
			) : (
				<div style={{ width: 20, height: 20, backgroundColor: "dodgerblue" }} />
			)}
			<div className="details-container">
				<div>
					<p className="account-name">{userData.username}</p>
					{/* <p className="timeOfUpload">{comment.timeOfUpload}</p> */}
				</div>
				<DescriptionInput
					onChange={onComment}
					onEnter={onPost}
					value={commentValue}
				/>
				<div className="button-container">
					<Button onClick={onPost}>send</Button>
				</div>
			</div>
		</div>
	);
}
