const express = require("express");
const router = express.Router();

const Pricing = require("../schema/Pricing");
const Store = require("../schema/Store");
const User = require("../schema/User");

const { initializePayment, verifyPayment } = require("../paystack");

router.post("/", async (req, res) => {
	const { plan, subPlan } = req.body;

	const pricing = await Pricing.findById(plan);
	let amount = 0;
	if (subPlan) {
		const subPricing = pricing.content[0].subData;
		amount = subPricing.find((sub) => sub.id === subPlan).value;
	} else {
		amount = pricing.pricing;
	}

	// generate paystack data
	const user = await User.findById(req.user.id);

	const transaction = {
		email: user.emailAddress,
		amount: amount * 100,
		metadata: {
			user_id: user.id,
			store_id: req.user.storeId,
		},
	};

	const {
		data: { authorization_url },
	} = await initializePayment(transaction);
	res.send(authorization_url);
	// res.redirect(response.data.authorization_url);
});

router.get("/callback", async (req, res) => {
	console.log(req.query);
	const result = await verifyPayment(req.query.trxref);
	const { store_id, plan, subPlan } = result;
	if (!result) return res.send("failed").status(500);
	const store = await Store.findById(store_id);
	const pricing = await Pricing.findById(plan);
	if (!store.active) store.activated = true;
	if (subPlan) {
		const subData = pricing.content[0].subData.find(
			(item) => item.id === subPlan
		);
		store.clientLimit += subData.amount;
		store.plan = "basic";
		await store.save();
		return res.json({ status: "successful" }).status(200);
	}

	// console.log(req.query);
});

module.exports = router;
