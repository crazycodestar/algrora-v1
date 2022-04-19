const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	activated: {
		type: Boolean,
		required: true,
		default: false,
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: "product",
		required: true,
	},
	orderKey: {
		type: String,
		require: true,
	},
	quantity: {
		type: Number,
		required: [true, "quantity is required"],
	},
	store: {
		type: Schema.Types.ObjectId,
		ref: "store",
		required: true,
	},
	uploadTime: {
		type: Date,
		required: [true, "upload time is required"],
	},
	read: {
		type: Boolean,
		required: true,
	},
	updatedTime: {
		type: Date,
		required: [true, "updated time is required"],
	},
	lastActive: {
		type: String,
		enum: ["USER", "STORE"],
		required: [true, "sender required"],
	},
	// meetTime: String,
	// details: {
	// 	type: String,
	// 	minLength: [10, "details should be more than 10 characters"],
	// 	maxLength: [400, "details should be less than 400 characters"],
	// },
	// status: {
	// 	type: String,
	// 	enum: ["PENDING", "ACCEPTED", "REQUEST ALTERATION", "CANCEL"],
	// 	default: "PENDING",
	// },
	// message: {
	// 	type: String,
	// 	minLength: [10, "details should be more than 10 characters"],
	// 	maxLength: [400, "details should be less than 400 characters"],
	// },
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
