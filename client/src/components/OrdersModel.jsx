import React, { useState } from "react";

// css
import "./styles/ordersModel/ordersModel.css";

import DescriptionInput from "./DescriptionInput";
import Button from "./Button";

import * as Yup from "yup";

import { useSelector } from "react-redux";

// react date-picker
import { add } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form, Formik, useField } from "formik";
import TextBoxValidation from "./validation/TextBoxValidation";
import { gql } from "graphql-request";
import { request } from "graphql-request";
import { url } from "../config";

export default function OrdersModel({ orderId, onSubmit, isUser }) {
	const [message, setMessage] = useState("");
	const [startDate, setStartDate] = useState();
	const accountReducer = useSelector((state) => state.accountReducer);
	const orderValidationSchema = Yup.object().shape({
		status: Yup.string()
			.oneOf(["PENDING", "ACCEPTED", "REQUEST ALTERATION", "CANCEL"])
			.nullable()
			.required(),
		dateTime: isUser
			? Yup.date().nullable()
			: Yup.date("Must be a date").required("Date is required"),
		description: Yup.string().min(10).max(400).required(),
	});
	return (
		<div className="orderModal">
			<pre>{JSON.stringify({ orderId, isUser }, null, 2)}</pre>
			<Formik
				initialValues={{
					status: isUser ? "" : "PENDING",
					dateTime: null,
					description: "",
				}}
				validationSchema={orderValidationSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setSubmitting(true);
					const query = gql`
						mutation UpdateOrder(
							$order: OrderDetails!
							$orderId: String!
							$updateOrderType: Type!
						) {
							updateOrder(
								order: $order
								orderId: $orderId
								type: $updateOrderType
							) {
								status
								message
								orders {
									id
									details
									meetTime
									message
									status
									updatedTime
									uploadTime
								}
							}
						}
					`;
					const variables = {
						order: {
							meetTime: values.dateTime,
							details: isUser ? null : values.description,
							status: values.status,
							message: isUser ? values.description : null,
						},
						orderId,
						updateOrderType: isUser ? "USER" : "STORE",
					};
					const { updateOrder } = await request(url, query, variables, {
						Authorization: `bearer ${accountReducer.token}`,
					});
					setSubmitting(false);
					onSubmit(true, values);
					// onClose();
				}}
			>
				{({ values, errors, isSubmitting }) => (
					<Form>
						{isUser && (
							<div className="status">
								<span>Status:</span>
								<StatusPicker name="status" type="select" />
							</div>
						)}
						{!isUser && (
							<div className="date-picker">
								<span>Time:</span>
								<div className="picker">
									<DateTimePicker name="dateTime" type="datetime-local" />
								</div>
							</div>
						)}
						<TextBoxValidation
							placeholder={
								isUser
									? "enter follow up message"
									: "location and other details"
							}
							triggerFocus
							name="description"
							type="input"
						/>

						<div className="buttons">
							<Button secondary onClick={() => onSubmit(false)}>
								cancel
							</Button>
							<Button disabled={isSubmitting} type="submit">
								update
							</Button>
						</div>
						{/* {isUser && <p>isUser</p>} */}
						{/* <pre>{JSON.stringify(values, null, 2)}</pre>
						<pre>{JSON.stringify(errors, null, 2)}</pre> */}
					</Form>
				)}
			</Formik>
		</div>
	);
}

const DateTimePicker = ({ ...props }) => {
	const [field, meta] = useField(props);
	return (
		<>
			<input {...field} {...props} />
			<div>
				{meta.touched && meta.error ? (
					<div className="error">
						<p className="message-error">{meta.error}</p>
					</div>
				) : null}
			</div>
		</>
	);
};

const StatusPicker = ({ ...props }) => {
	const [field, meta] = useField(props);
	return (
		<>
			<select {...field} {...props}>
				<option value="">SELECT STATUS</option>
				<option>REQUEST ALTERATION</option>
				<option>ACCEPTED</option>
			</select>
			<div>
				{meta.touched && meta.error ? (
					<div className="error">
						<p className="message-error">{meta.error}</p>
					</div>
				) : null}
			</div>
		</>
	);
};
