import React, { useEffect, useState, useRef } from "react";
// dev components
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
// redux
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../actions/account";

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
import { url } from "../config";
import Avatar from "./Avatar";

const content = [
	{ name: "home", link: "/" },
	// { name: "account", link: "/account" },
	{ name: "cart", link: "/cart" },
	// { name: "messages", link: "/messages" },
];

const accountOptions = [
	{ name: "My Account", icon: StoreMallDirectoryIcon },
	// { name: "Orders" },
	{ name: "Orders", icon: ShoppingCartIcon },
	{ name: "Inbox", icon: InboxIcon },
	// { name: "Saved Items" },
	{ name: "LOGOUT", type: "danger", icon: LogoutIcon },
];

const searchRecommendation = [
	"powered chicken",
	"mashmellow poo",
	"strawberry shake",
	"banana flavoured ribena",
	"caprisone",
];

export default function NavigationBar({ onClick }) {
	const [searchValue, setSearchValue] = useState(null);
	const [recommendations, setRecommendations] = useState([]);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const accountReducer = useSelector((state) => state.accountReducer);
	const dispatch = useDispatch();
	const signOut = () => dispatch(logOut());
	const history = useHistory();
	const container = useRef();

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mouseUp", handleClickOutside);
		};
	}, []);

	const handleClickOutside = (event) => {
		if (container.current && !container.current.contains(event.target)) {
			setShowDropdown(false);
		}
	};

	const handleSearch = () => {
		if (searchValue) history.push(`/search?search=${searchValue}`);
	};

	const handleChange = async (value) => {
		setSearchValue(value);
		const query = gql`
			query Query($search: String!) {
				search(search: $search) {
					name
				}
			}
		`;
		const variables = {
			search: value,
		};
		const { search } = await request(url, query, variables);
		setRecommendations(search);
	};

	const handleOption = (option) => {
		setShowDropdown(false);
		switch (option) {
			case "My Account":
				history.push("/account");
				break;
			case "Orders":
				history.push("/orders");
				break;
			case "Inbox":
				history.push("/inbox");
				break;
			case "Saved Items":
				console.log("not implemented yet");
				break;
			case "LOGOUT":
				signOut();
				localStorage.removeItem("token");
				localStorage.removeItem("userData");
				history.push("/SignIn");
		}
	};
	return (
		<div className="navigationBar-container">
			<Link to="/">
				<div className="logo-container">
					<img src={logo} alt="algrora" />
					<p className="brandName">algrora</p>
				</div>
			</Link>
			<div>
				<div>
					<div className="options-container">
						{content.map((item) => (
							<Link to={item.link}>
								<p>{item.name}</p>
							</Link>
						))}
					</div>

					<div ref={container} className="account-container">
						{accountReducer.token ? (
							<div className="details">
								<div onClick={() => setShowDropdown(!showDropdown)}>
									{accountReducer.imageUri ? (
										<img
											src={accountReducer.imageUri}
											alt={accountReducer.name}
											className="account-image"
										/>
									) : (
										// <img src={femaleAccount} className="account-placeholder" />
										<Avatar styles={{ width: 24, height: 24 }} />
									)}
									<p>{accountReducer.userData.username.toLowerCase()}</p>

									<ExpandMoreIcon sx={{ fontSize: 18 }} />
									{/* <DropdownMenu
									options={accountOptions}
									onOption={handleOption}
								/> */}
								</div>
								{showDropdown && (
									<AccountDropdown
										options={accountOptions}
										onOption={handleOption}
									/>
								)}
							</div>
						) : (
							<Link to="/signin">
								<p>sign in</p>
							</Link>
						)}
					</div>
				</div>
				<div className="search-container">
					<Input
						placeholder="search"
						onChange={(e) => handleChange(e.target.value)}
						onEnter={handleSearch}
						setSelected={setDropdownVisible}
						list="search-options"
						Icon={SearchIcon}
					/>
					<datalist id="search-options">
						{recommendations.map((item) => (
							<option value={item.name}>{item.name}</option>
						))}
					</datalist>
				</div>
			</div>
		</div>
	);
}

const AccountDropdown = ({ options, onOption }) => {
	return (
		<div className="accountDropdown-container">
			<div className="main-container">
				<Avatar styles={{ width: 32, height: 32 }} />
				<div>
					<h3>olalekan adekanmbi</h3>
					<p>olamilekanadekanmbi@gmail.com</p>
				</div>
				<div className="edit">
					<EditIcon sx={{ fontSize: 22 }} />
				</div>
			</div>
			<hr />
			{options.map((option) => (
				<div
					key={uuidv4()}
					className="option"
					onClick={() => onOption(option.name)}
				>
					{/* <svg data-testid={`${option.name}`} /> */}
					<SvgIcon component={option.icon} />
					<p>{option.name}</p>
				</div>
			))}
		</div>
	);
};
