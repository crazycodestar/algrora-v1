const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
	name: { type: String, required: true },
	description: String,
	imageUri: String,
	popularity: {
		type: String,
		default: 0,
	},
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
