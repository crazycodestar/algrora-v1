import request, { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { header, url } from "../config";

import Button from "../components/Button";
import "./styles/pricingScreen/pricingScreen.css";

// svgs
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
// import { usePaystackPayment } from "react-paystack";
import useScript from "../hooks/useScript";

export default function PricingScreen({ history }) {
	const { token } = useSelector((state) => state.accountReducer);
	const [clientSize, setClientSize] = useState(null);
	const [pricings, setPricings] = useState([]);
	const [isNew, setIsNew] = useState(false);
	const accountReducer = useSelector((state) => state.accountReducer);

	useScript("https://js.paystack.co/v1/inline.js");

	useEffect(async () => {
		const query = gql`
			query GetPricing {
				getPricing {
					plans
					isNew
				}
			}
		`;
		const { getPricing } = await request(url, query, null, header(token));
		if (getPricing) {
			setPricings(JSON.parse(getPricing.plans));
			setIsNew(getPricing.isNew);
		}
	}, []);

	const handleSuccess = async (reference) => {
		console.log(reference);
		const request = await fetch(
			`/paystack/callback?trxref=${reference.trxref}`,
			{
				headers: {
					authorization: `bearer ${accountReducer.token}`,
					"content-type": "application/json",
				},
			}
		);
		const response = request;
		if (response.status === 200) return history.push("/account");
	};
	return (
		<div className="pricingScreen">
			<div className="heading-container">
				<p>pricing</p>
				<h1>start selling today with plans that suit your wallet</h1>
			</div>
			<div className="pricing-container">
				{pricings &&
					pricings.map((price, index) => {
						const evaluatePrice = () => {
							if (price.pricing)
								return {
									plan: {
										plan: price._id,
										subPlan: null,
										amount: price.pricing,
									},
									isSecondary: true,
									style: { border: "0.5px solid white", color: "white" },
								};
							if (clientSize) {
								return {
									plan: {
										plan: price._id,
										subPlan: clientSize._id,
										amount: clientSize.value,
									},
								};
							}
							return { amount: 0 };
						};
						const evaluated = evaluatePrice();
						return (
							<div className={`pricing-wrapper ${index ? "premium" : ""}`}>
								<h2 className="plan-name">{price.plan}</h2>
								<p className="plan-description">{price.description}</p>
								{price.content.map((contentItem) => {
									const flag = {};

									switch (contentItem.status) {
										case 1:
											flag.colour = "success";
											flag.render = (
												<CheckIcon sx={{ fontSize: 18, color: "#42ba96" }} />
											);
											break;
										case 0:
											flag.colour = "amber";
											flag.render = (
												<RemoveIcon sx={{ fontSize: 18, color: "#ffbf00" }} />
											);
											break;
										case -1:
											flag.colour = "danger";
											flag.render = (
												<CloseIcon sx={{ fontSize: 18, color: "#df4759" }} />
											);
											break;
									}
									return (
										<div className="content-wrapper">
											<div className="topic-container">
												<div className={`content-flag ${flag.colour}`}>
													{flag.render}
												</div>
												<p>{contentItem.info}</p>
											</div>
											{contentItem.subData.length ? (
												<div className="sub-content-container">
													{contentItem.subData.map((item) => {
														return (
															<div
																className={`sub-content ${
																	clientSize === item ? "selected" : ""
																}`}
																onClick={() => setClientSize(item)}
															>
																<div>
																	<div>
																		<p>{item.key}</p>
																		{isNew ? <p>+2 free</p> : null}
																	</div>
																	<span>₦{item.value}</span>
																</div>
															</div>
														);
													})}
												</div>
											) : null}
										</div>
									);
								})}
								<div className="button-container">
									<PayStackPurchase
										isNew={isNew}
										details={evaluated.plan}
										isSecondary={evaluated.isSecondary}
										style={evaluated.style}
										onSuccess={handleSuccess}
									/>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}

const PayStackPurchase = ({
	isNew,
	details,
	isSecondary,
	style,
	onSuccess,
}) => {
	const accountReducer = useSelector((state) => state.accountReducer);

	const handleClick = (e) => {
		// initializePayment(onSuccess);
		e.preventDefault();
		const handler = window.PaystackPop.setup({
			key: "pk_test_0d4628adca1acc7f0260de3bfb1799a314d5ae82",
			email: accountReducer.userData.emailAddress,
			amount: details.amount * 100,
			metadata: {
				user_id: accountReducer.userData.id,
				store_id: accountReducer.userData.store,
				...details,
			},
			ref: "" + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
			callback: function (response) {
				onSuccess(response);
			},
		});
		handler.openIframe();
	};
	if (!details || !details.amount)
		return <Button disabled>select a plan</Button>;
	return (
		<Button onClick={handleClick} secondary={isSecondary} style={style}>
			₦{details && details.amount}
		</Button>
	);
};
