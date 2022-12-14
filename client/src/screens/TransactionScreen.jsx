import request, { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { header } from "../config";

import "./styles/transactionScreen/transactionScreen.css";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ActivityIndicator from "../components/ActivityIndicator";
import NoResults from "../components/NoResults";

export default function TransactionScreen() {
	const accountReducer = useSelector((state) => state.accountReducer);
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setLoading] = useState(true);
	useEffect(async () => {
		const query = gql`
			query GetTransactions {
				getTransactions {
					status
					message
					transactions {
						reference
						amount
						paidAt
						plan {
							plan
						}
						subPlan {
							key
							value
						}
					}
				}
			}
		`;
		const { getTransactions } = await request(
			"/graphql",
			query,
			{},
			header(accountReducer.token)
		);
		console.log(getTransactions);
		if (getTransactions.status === "success") {
			setLoading(false);
			return setTransactions(
				getTransactions.transactions.map((item) => {
					const paidAt = new Date(+item.paidAt).toLocaleString(undefined, {
						timeZone: "UTC",
					});
					return { ...item, paidAt };
				})
			);
		}
		setLoading(false);
	}, []);

	const handleTransactionDisplay = () => {
		if (isLoading)
			return (
				<div className="empty-container">
					<ActivityIndicator />
				</div>
			);

		if (!transactions.length)
			return (
				<div className="empty-container">
					<NoResults />
				</div>
			);
		return transactions.map((transaction) => {
			const breakdown = Object.entries(transaction);
			return (
				<TransactionSheet breakdown={breakdown} transaction={transaction} />
			);
		});
	};

	return (
		<div className="transactionScreen body-container">
			<h2>transaction</h2>
			<p>
				if there are any transactions issues please write a mail to{" "}
				<i>altechbusinesses@gmail.com</i> and we will help you sort out the
				issue{" "}
			</p>
			<div className="transaction-container">{handleTransactionDisplay()}</div>
		</div>
	);
}

const TransactionSheet = ({ transaction, breakdown }) => {
	const [isActive, setIsActive] = useState(false);
	return (
		<div className="transaction-wrapper">
			<div className="trans-summary">
				<div className="parts">{transaction.plan.plan}</div>
				<div className="parts">#{transaction.reference}</div>
				<div className="parts">???{transaction.amount}</div>
				<div className="extra-parts">
					<p>{transaction.paidAt}</p>
					<div
						className={`chevron-container ${isActive ? "active" : ""}`}
						onClick={() => setIsActive(!isActive)}
					>
						<KeyboardArrowRightIcon sx={{ fontSize: 24 }} />
					</div>
				</div>
			</div>
			<div className={`trans-breakdown ${isActive ? "active" : ""}`}>
				{breakdown.map((item) => {
					return <Breakdown breakdown={item} />;
				})}
			</div>
		</div>
	);
};

const Breakdown = ({ breakdown }) => {
	if (typeof breakdown[1] === "object") {
		const listing = Object.entries(breakdown[1]);
		return (
			<div className="second-container">
				<div className="header">{breakdown[0]}</div>
				{listing.map((item) => (
					<Breakdown breakdown={item} />
				))}
			</div>
		);
	}
	return (
		<div className="sub-container">
			<div className="header">{breakdown[0]}</div>
			<div className="content">{breakdown[1]}</div>
		</div>
	);
};
