import React, { useRef, useState } from "react";
import NavigationBar from "../components/NavigationBar";

// css
import "./styles/messagingScreen/messagingScreen.css";

// components
import MessageAccount from "../components/MessageAccount";
import SearchBox from "../components/SearchBox";
import Input from "../components/Input";
import Button from "../components/Button";

// external components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DescriptionInput from "../components/DescriptionInput";

const DATA = [
	{
		id: "1",
		name: "Olalekan Adekanmbi",
		time: "12:06 AM",
		image: "https://picsum.photos/id/237/200/300",
		lastMessage: "how about the deal ?",
	},
	{
		id: "2",
		name: "David Nndama",
		time: "8:20 PM",
		image: "https://picsum.photos/id/237/200/300",
		lastMessage: "is the product ready",
	},
	{
		id: "3",
		name: "fadayomi nfowo",
		time: "10:01 AM",
		image: "https://picsum.photos/id/237/200/300",
		lastMessage: "what is your last price ?",
	},
];

const messages = [
	{
		id: "1",
		messageFrom: "user",
		type: "default",
		content:
			"Pellentesque porttitor, velit lacinia egestas auctor, diam eros tempus arcu, nec vulputate augue magna vel risus. Cras non magna vel ante adipiscing rhoncus. Vivamus a mi. Morbi neque. Aliquam erat volutpat. Integer ultrices lobortis eros.",
		timeOfUpload: "12:02 PM",
	},
	{
		id: "2",
		messageFrom: "provider",
		type: "default",
		content:
			"Pellentesque porttitor, velit lacinia egestas auctor, diam eros tempus arcu, nec vulputate augue magna vel risus. Cras non magna vel ante adipiscing rhoncus. Vivamus a mi. Morbi neque. Aliquam erat volutpat. Integer ultrices lobortis eros.",
		timeOfUpload: "12:02 PM",
	},
	{
		id: "3",
		messageFrom: "provider",
		type: "default",
		content: "Please reply.",
		timeOfUpload: "12:03 PM",
	},
	{
		id: "4",
		messageFrom: "user",
		type: "default",
		content:
			"Pellentesque porttitor, velit lacinia egestas auctor, diam eros tempus arcu, nec vulputate augue magna vel risus. Cras non magna vel ante adipiscing rhoncus. Vivamus a mi. Morbi neque. Aliquam erat volutpat. Integer ultrices lobortis eros.",
		timeOfUpload: "12:10 PM",
	},
	{
		id: "5",
		messageFrom: "user",
		type: "reply",
		initialMessage: "2",
		content: "this is a message reply",
		timeOfUpload: "12:10 PM",
	},
];

export default function MessagingScreen() {
	const messageContainer = useRef();
	const [replyMessage, setReplyMessage] = useState(null);
	const [timeline, setTimeline] = useState([...messages]);
	const [messageData, setMessageData] = useState("");
	const [blink, setBlink] = useState(null);

	const handleSend = () => {
		const formatTime = (time) => {
			const rawTime = time.split(":");
			if (parseInt(rawTime[1]) < 10) {
				rawTime[1] = "0" + rawTime[1];
			}
			if (rawTime[0] < 12) return `${rawTime[0]}:${rawTime[1]} AM`;
			return `${parseInt(rawTime[0]) - 12}:${rawTime[1]} PM`;
		};
		const today = new Date();
		const time = today.getHours() + ":" + today.getMinutes();
		// create new message
		let newMessage = {
			id: (timeline.length + 1).toString(),
			messageFrom: "user",
			content: messageData.trim(),
			timeOfUpload: formatTime(time),
		};

		if (replyMessage) {
			newMessage = {
				...newMessage,
				type: "reply",
				initialMessage: replyMessage.id,
			};
		}
		setMessageData("");
		if (newMessage.content) {
			setTimeline([...timeline, newMessage]);
			// clean up
			setReplyMessage(null);
			setTimeout(() => {
				messageContainer.current.scrollBy({
					top: messageContainer.current.scrollHeight + 100,
					// left: 0,
					behavior: "smooth",
				});
			}, 10);
		}
	};

	const handleScrollToMessage = (messageIndex) => {
		setBlink(messageIndex);
		const scrollToMessage = messageContainer.current.querySelector(
			`#message-${messageIndex}`
		);
		setTimeout(() => {
			scrollToMessage.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "nearest",
			});
		}, 10);
	};

	const handleReplyMessage = (message) => {
		setReplyMessage(message);
	};
	return (
		<div>
			<div className="messagingScreen-container">
				<div className="messages-container">
					<SearchBox />
					{DATA.map((item) => (
						<MessageAccount key={item.id} messageAccount={item} />
					))}
				</div>
				<div className="messaging-container">
					<div className="heading">
						<p className="name">Olalekan Adekanmbi</p>
						<p className="status">online</p>
					</div>
					<div className="messaging-wrapper">
						<div ref={messageContainer} className="messages-section">
							{timeline.map((item) => (
								<Message
									initialMessage={
										item.type === "reply"
											? timeline[item.initialMessage - 1]
											: undefined
									}
									message={item}
									key={item.id}
									onReplyMessage={handleReplyMessage}
									onScrollToMessage={handleScrollToMessage}
									active={blink}
								/>
							))}
						</div>
						<div className="text-section">
							{replyMessage && (
								<div className="replyMessage-container">
									<FontAwesomeIcon icon={faReply} />
									<div className="reply-details">
										<p className="reply-name">{replyMessage.messageFrom}</p>
										<p className="reply-body">{replyMessage.content}</p>
									</div>
									<div
										className="close-container"
										onClick={() => setReplyMessage(null)}
									>
										<FontAwesomeIcon icon={faTimes} />
									</div>
								</div>
							)}
							<div className="text-wrapper">
								{/* <Input
									placeholder="type here"
									style={{ flex: 1 }}
									onChange={(e) => setMessageData(e.target.value)}
									value={messageData}
									onEnter={handleSend}
									focusMonitor={[replyMessage]}
								/> */}
								<DescriptionInput
									rows={1}
									placeholder="type here"
									style={{ flex: 1 }}
									onChange={(e) => setMessageData(e.target.value)}
									value={messageData}
									onEnter={handleSend}
									focusMonitor={[replyMessage]}
								/>
								<Button secondary onClick={handleSend}>
									<FontAwesomeIcon icon={faMicrophoneSlash} />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const Message = ({
	message,
	initialMessage,
	onScrollToMessage,
	onReplyMessage,
	active,
}) => {
	const { id, content, timeOfUpload, messageFrom } = message;
	const messageStyle =
		messageFrom === "user" ? "sender-message" : "reciever-message";
	const messageStyle2 =
		messageFrom === "user"
			? "sender-message-container"
			: "reciever-message-container";

	const messageId = `message-${id}`;
	return (
		<div
			id={messageId}
			className={`message-wrapper ${messageStyle2} ${
				active == id && "active-animation"
			}`}
		>
			<div className={`message-container ${messageStyle}`}>
				{initialMessage && (
					<div
						// href={`#${initialMessage.id}`}
						className="message-reply"
						onClick={() => onScrollToMessage(initialMessage.id)}
					>
						<p className="initial-header">{initialMessage.messageFrom}</p>
						<p className="initial-body">{initialMessage.content}</p>
					</div>
				)}
				<p className="message">{content}</p>
				<div className="bottom-details">
					<p className="timeOfUpload">{timeOfUpload}</p>
					{messageFrom === "user" && <FontAwesomeIcon icon={faCheck} />}
				</div>
			</div>
			<button
				className="reply-button-container"
				onClick={() => onReplyMessage(message)}
			>
				<FontAwesomeIcon icon={faReply} />
			</button>
		</div>
	);
};
