const User = require("../schema/User");
const Store = require("../schema/Store");
const { generateErrorsMessage } = require("../utilities");
const Pricing = require("../schema/Pricing");

// queries
module.exports.getPricing = async () => {
	const pricing = await Pricing.find({});
	const details = {
		plans: JSON.stringify(pricing),
		isNew: false,
	};
	return details;
};

// Mutations
module.exports.addStore = async (_, args, { userData }) => {
	console.log("adding store");
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

module.exports.buyClients = async (_, { ref }, { userData }) => {
	console.log("he re");
	console.log(ref);
	return 0;
};
