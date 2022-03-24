const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pricingSchema = new Schema({
	plan: String,
	description: String,
	pricing: Number,
	content: [
		{
			info: String,
			status: {
				type: Number,
				enum: [1, 0, -1],
			},
			subData: [
				{
					key: String,
					amount: Number,
					value: Number,
				},
			],
		},
	],
});

const Pricing = mongoose.model("pricing", pricingSchema);

module.exports = Pricing;
