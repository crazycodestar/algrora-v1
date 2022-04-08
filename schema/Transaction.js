const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
	status: {
		type: Boolean,
		required: true,
	},
	reference: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	paidAt: {
		type: Date,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	storeId: {
		type: Schema.Types.ObjectId,
		ref: "store",
		required: true,
	},
	plan: {
		type: Schema.Types.ObjectId,
		ref: "pricing",
		required: true,
	},
	subPlan: {
		type: Schema.Types.ObjectId,
		ref: "pricing.content.subData",
		default: null,
	},
	referrer: {
		type: String,
		required: true,
	},
});

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;
