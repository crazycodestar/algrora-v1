const express = require("express");
const router = express.Router();

const Pricing = require("../schema/Pricing");
const Store = require("../schema/Store");
const User = require("../schema/User");

const { initializePayment, verifyPayment } = require("../paystack");
const Transaction = require("../schema/Transaction");

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
	console.log("is paystack working");
	console.log(req.body);
	return res.json({ status: "success" }).sendStatus(200);
	const { trxref } = req.query;
	const trx = await Transaction.findOne({ reference: trxref });
	if (trx)
		return res
			.json({ status: "failed", message: "transaction alreay processed" })
			.status(200);

	const result = await verifyPayment(trxref);
	const data = result.data;
	const metadata = result.data.metadata;

	const { store_id, plan, subPlan } = result.data.metadata;
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

		// log transaction
		const transaction = new Transaction({
			status: result.status,
			message: result.message,
			reference: data.reference,
			amount: data.amount / 100,
			paidAt: data.paid_at,
			userId: metadata.user_id,
			storeId: metadata.store_id,
			plan: metadata.plan,
			subPlan: metadata.subPlan,
			referrer: metadata.referrer,
		});

		try {
			transaction.save();
		} catch (err) {
			console.log(err);
		}

		return res.json({ status: "successful" }).status(200);
	}

	// console.log(req.query);
});

router.post("/my/webhook/url", function (req, res) {
	//validate event
	var hash = crypto
		.createHmac("sha512", secret)
		.update(JSON.stringify(req.body))
		.digest("hex");
	if (hash == req.headers["x-paystack-signature"]) {
		// Retrieve the request's body
		var event = req.body;
		// Do something with event
		console.log(event);
		return res.send(event);
	}
});

module.exports = router;
