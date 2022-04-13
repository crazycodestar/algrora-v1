const User = require("../schema/User");
const Store = require("../schema/Store");
const { generateErrorsMessage } = require("../utilities");
const Pricing = require("../schema/Pricing");
const Transaction = require("../schema/Transaction");

// queries
module.exports.getPricing = async (_, __, { userData }) => {
	const pricing = await Pricing.find({});
	const user = await User.findById(userData.id);
	const store = await Store.findById(user.store);
	let isNew = false;
	if (!store.activated) isNew = true;
	const details = {
		plans: JSON.stringify(pricing),
		isNew,
	};
	return details;
};

module.exports.initStore = async (_, __, { userData }) => {
	const user = await User.findById(userData.id);
	const store = await Store.findById(user.store);

	if (store.activated)
		return { status: "failed", message: "store already active" };

	// might reset some previous client limit
	store.clientLimit = 2;
	store.activated = true;

	try {
		await store.save();
		return { status: "success" };
	} catch (err) {
		const errorMessage = generateErrorsMessage(err);
		return {
			status: "failed",
			message: errorMessage,
		};
	}
};

module.exports.getTransactions = async (_, __, { userData }) => {
	const store = await Store.findById(userData.storeId);
	if (!store) return { status: "failed", message: "unauthorized access" };

	const transactions = await Transaction.find({ storeId: store.id });
	return { status: "success", transactions };
};

// Mutations
module.exports.addStore = async (_, args, { userData }) => {
	const { name, imageUri, description } = args;
	const user = await User.findById(userData.id);
	if (user.store)
		return { status: "failed", message: "user already has a store" };
	const store = new Store({
		name,
		imageUri,
		description,
	});

	try {
		const storeData = await store.save();
		user.store = storeData.id;
		await user.save();
		return {
			status: "success",
			message: `${storeData.id}`,
			store: storeData,
		};
	} catch (err) {
		const errorMessage = generateErrorsMessage(err);
		return {
			status: "failed",
			message: errorMessage,
		};
	}
};
