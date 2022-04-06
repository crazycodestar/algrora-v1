import React, { useEffect, useState, useRef } from "react";
// dev components
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
// redux
import { useSelector, useDispatch } from "react-redux";
import { logOut, update } from "../actions/account";
import { updateUnread } from "../actions/navigation";

import CameraAltIcon from "@mui/icons-material/CameraAlt";

// styling
import "./styles/navigationBar/navigationBar.css";
import logo from "../logo.svg";
import maleAccount from "../images/undraw_male_avatar_323b.svg";
import femaleAccount from "../images/undraw_female_avatar_w3jk.svg";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// componnents
import Button from "./Button";
import Input from "./Input";
import DropdownMenu from "./DropdownMenu";

// dropdown icons
import { SvgIcon } from "@mui/material";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InboxIcon from "@mui/icons-material/Inbox";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";

// graphql
import request, { gql } from "graphql-request";
import { header, url } from "../config";
import Avatar from "./Avatar";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "./validation/ErrorMessage";
import MenuIcon from "@mui/icons-material/Menu";
import { uploadImage } from "../utilityFunctions";

const content = [
	{ name: "home" },
	// { name: "account", link: "/account" },
	{ name: "cart" },
	// { name: "messages", link: "/messages" },
];

export default function NavigationBar({ onClick }) {
	const [searchValue, setSearchValue] = useState(null);
	const [recommendations, setRecommendations] = useState([]);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [mobileDropdown, setMobileDropdown] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const accountReducer = useSelector((state) => state.accountReducer);
	// const navigationReducer = useSelector((state) => state.navigationReducer)
	const dispatch = useDispatch();
	const signOut = () => dispatch(logOut());
	const unread = (data) => dispatch(updateUnread(data));
	const navigationReducer = useSelector((state) => state.navigationReducer);
	const history = useHistory();
	const container = useRef();

	useEffect(async () => {
		if (accountReducer.token) {
			const query = gql`
				query Query {
					isOrder {
						status
						message
					}
				}
			`;
			const { isOrder } = await request(
				url,
				query,
				null,
				header(accountReducer.token)
			);

			if (isOrder.status) {
				const parse = JSON.parse(isOrder.message);
				unread({
					unReadOrder: parse[0],
					unReadInbox: parse[1],
					isStore: accountReducer.userData.store,
				});
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mouseUp", handleClickOutside);
		};
	}, [
		accountReducer.token,
		accountReducer.userData && accountReducer.userData.store,
	]);

	const handleClickOutside = (event) => {
		if (container.current && !container.current.contains(event.target)) {
			setShowDropdown(false);
		}
	};

	const handleSearch = () => {
		if (searchValue) history.push(`/search?search=${searchValue}`);
	};

	// const handleChange = async (value) => {
	// 	setSearchValue(value);
	// 	const query = gql`
	// 		query Query($search: String!) {
	// 			search(search: $search) {
	// 				name
	// 			}
	// 		}
	// 	`;
	// 	const variables = {
	// 		search: value,
	// 	};
	// 	const { search } = await request(url, query, variables);
	// 	setRecommendations(search);
	// };

	const handleOption = (option) => {
		setShowDropdown(false);
		setMobileDropdown(false);
		switch (option) {
			case "My Account":
				history.push("/account");
				break;
			case "Orders":
				history.push("/orders");
				break;
			case "signIn":
				history.push("/signIn");
				break;
			case "home":
				history.push("/");
				break;
			case "cart":
				history.push("/cart");
				break;
			case "Inbox":
				history.push("/inbox");
				break;
			case "Saved Items":
				console.log("not implemented yet");
				break;
			case "LOGOUT":
				signOut();
				history.push("/SignIn");
		}
	};

	const total = [
		navigationReducer.dropdownOptions[1].count,
		navigationReducer.dropdownOptions[2].count,
	].reduce((a, b) => a + b, 0);
	return (
		<div className="navigationBar-container">
			<div className="logo-container">
				<div onClick={() => handleOption("home")}>
					<img src={logo} alt="algrora" />
					<p className="brandName">algrora</p>
				</div>

				<div
					onClick={() => setMobileDropdown(!mobileDropdown)}
					className="hambuger-menu"
				>
					<MenuIcon fontSize="medium" />
				</div>
			</div>
			<div className={`dropdown-container ${mobileDropdown ? "active" : ""}`}>
				<div>
					<div className="options-container">
						{content.map((item) => (
							<div onClick={() => handleOption(item.name)}>
								<p>{item.name}</p>
							</div>
						))}
					</div>

					<div ref={container} className="account-container">
						{accountReducer.token ? (
							<div className="details">
								<div
									className="shortForm-info-container"
									onClick={() => setShowDropdown(!showDropdown)}
								>
									{accountReducer.imageUri ? (
										<img
											src={accountReducer.imageUri}
											alt={accountReducer.name}
											className="account-image"
										/>
									) : (
										// <img src={femaleAccount} className="account-placeholder" />
										<Avatar
											image={accountReducer.userData.imageUri}
											styles={{ width: 24, height: 24 }}
										/>
									)}
									<p>{accountReducer.userData.username.toLowerCase()}</p>
									{total ? (
										<span className="unRead-bubble">
											<h5>{total}</h5>
										</span>
									) : null}

									<ExpandMoreIcon sx={{ fontSize: 18 }} />
									{/* <DropdownMenu
									options={accountOptions}
									onOption={handleOption}
								/> */}
								</div>
								{showDropdown && (
									<AccountDropdown
										options={navigationReducer.dropdownOptions}
										onOption={handleOption}
									/>
								)}
							</div>
						) : (
							<div onClick={() => handleOption("signIn")}>
								<p>sign in</p>
							</div>
						)}
					</div>
				</div>
				<div className="search-container">
					<Input
						placeholder="search"
						onChange={(e) => setSearchValue(e.target.value)}
						onEnter={handleSearch}
						setSelected={setDropdownVisible}
						// list="search-options"
						Icon={SearchIcon}
					/>
					{/* <datalist id="search-options">
						{recommendations.map((item) => (
							<option value={item.name}>{item.name}</option>
						))}
					</datalist> */}
				</div>
			</div>
		</div>
	);
}

const AccountDropdown = ({ options, onOption }) => {
	const [showNameInput, setShowNameInput] = useState(false);
	const accountReducer = useSelector((state) => state.accountReducer);
	const dispatch = useDispatch();

	return (
		<div className="accountDropdown-container">
			<div className="main-container">
				<CameraContainer />
				<div className="details-container">
					{showNameInput ? (
						<AccountName
							showNameInput={showNameInput}
							setShowNameInput={setShowNameInput}
						/>
					) : (
						<>
							<div className="accountName-container">
								<h3>{accountReducer.userData.username}</h3>
								<p
									className="edit"
									onClick={() => setShowNameInput(!showNameInput)}
								>
									edit
								</p>
							</div>
						</>
					)}
					<p>{accountReducer.userData.emailAddress}</p>
				</div>
				{/* <div className="edit">
					<EditIcon sx={{ fontSize: 22 }} />
				</div> */}
			</div>
			<hr />
			{options.map((option) => {
				if (Object.keys(option).length)
					return (
						<div
							key={uuidv4()}
							className="option"
							onClick={() => onOption(option.name)}
						>
							{/* <svg data-testid={`${option.name}`} /> */}
							<div className="option-details-container">
								<SvgIcon component={option.icon} />
								<p>{option.name}</p>
							</div>
							{option.count ? (
								<span className="unRead-bubble">
									<h5>{option.count}</h5>
								</span>
							) : null}
						</div>
					);
			})}
		</div>
	);
};

const AccountName = ({ showNameInput, setShowNameInput }) => {
	const accountReducer = useSelector((state) => state.accountReducer);
	const inputRef = useRef();

	const dispatch = useDispatch();
	const setName = (data) => dispatch(update(data));

	useEffect(() => {
		if (showNameInput) inputRef.current.focus();
	}, [showNameInput]);

	const validationSchema = Yup.object().shape({
		accountName: Yup.string().min(3).max(255).required(),
	});

	return (
		<Formik
			initialValues={{ accountName: "" }}
			validationSchema={validationSchema}
			onSubmit={async (values, { setSubmitting, setErrors }) => {
				setSubmitting(true);
				const query = gql`
					mutation UpdateUser($data: UserInput) {
						updateUser(data: $data) {
							status
							message
						}
					}
				`;

				const variables = {
					data: {
						username: values.accountName,
					},
				};
				const { updateUser } = await request(
					url,
					query,
					variables,
					header(accountReducer.token)
				);
				if (updateUser.status === "success") {
					setName({ username: values.accountName });
					setShowNameInput(false);
				} else {
					setErrors({ accountName: "accountName taken" });
				}
				setSubmitting(false);
			}}
		>
			{({
				values,
				errors,
				touched,
				isSubmitting,
				handleBlur,
				handleChange,
			}) => (
				<Form>
					<div className="accountName-container">
						{/* <Field name="accountName" type="input" as={nameInput} /> */}
						<div className="accountName-wrapper">
							<input
								name="accountName"
								value={values.accountName}
								onChange={handleChange}
								onBlur={handleBlur}
								className="editUsername-input"
								type="text"
								placeholder={accountReducer.userData.username}
								ref={inputRef}
							/>
							{isSubmitting ? <div className="mini-loader" /> : null}
							{touched.accountName && errors.accountName ? (
								<ErrorMessage error={errors.accountName} />
							) : null}
						</div>

						<div className="options-minor-container">
							<button type="submit" className="edit">
								save
							</button>
							<button
								type="button"
								className="edit"
								onClick={() => setShowNameInput(!showNameInput)}
							>
								cancel
							</button>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

const CameraContainer = () => {
	const [showImage, setShowImage] = useState(true);
	const accountReducer = useSelector((state) => state.accountReducer);
	const imagePicker = useRef();

	const dispatch = useDispatch();

	const addImage = (data) => dispatch(update(data));

	const getImage = () => {
		imagePicker.current.click();
	};
	const handleImageChange = async (e) => {
		const fileData = e.target.files[0];
		if (!fileData) return;

		let imageUri = null;
		// upload image
		const query = gql`
			mutation Mutation($filename: String!, $fileType: String!) {
				signS3(filename: $filename, fileType: $fileType)
			}
		`;
		const variables = {
			// filename: generateFilename(fileData.name, fileData.type),
			filename: fileData.name,
			fileType: fileData.type,
		};
		const { signS3 } = await request(url, query, variables, {
			Authorization: `bearer ${accountReducer.token}`,
		});
		if (signS3) {
			try {
				await uploadImage(signS3, fileData);
			} catch (err) {
				return;
			}
			imageUri = signS3.split("?")[0];
			// update database
			const query = gql`
				mutation Mutation($data: UserInput) {
					updateUser(data: $data) {
						status
						message
					}
				}
			`;
			const variables = {
				data: {
					imageUri: imageUri,
				},
			};
			const { updateUser } = await request(
				url,
				query,
				variables,
				header(accountReducer.token)
			);
			if (updateUser.status == "success") {
				addImage({ imageUri: imageUri });
			}
		}
	};
	return (
		<div
			onMouseEnter={() => setShowImage(false)}
			onMouseLeave={() => setShowImage(true)}
			onClick={getImage}
		>
			{showImage ? (
				<Avatar
					image={accountReducer.userData.imageUri}
					styles={{ width: 32, height: 32 }}
				/>
			) : (
				<div className="camera-container">
					<input
						type="file"
						style={{ display: "none" }}
						ref={imagePicker}
						onChange={(e) => handleImageChange(e)}
					/>
					<CameraAltIcon sx={{ fontSize: 18 }} />
				</div>
			)}
		</div>
	);
};
