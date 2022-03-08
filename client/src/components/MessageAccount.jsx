import React from "react";

// css
import "./styles/messageAccount/messageAccount.css";

export default function MessageAccount({ messageAccount }) {
	return (
		<div className="messageAccount-container">
			<img
				src={messageAccount.image}
				alt={messageAccount.name}
				className="image-container"
			/>
			<div className="details-container">
				<div>
					<p className="name">{messageAccount.name}</p>
					<p className="time">{messageAccount.time}</p>
				</div>
				<p className="lastMessage">{messageAccount.lastMessage}</p>
			</div>
		</div>
	);
}
