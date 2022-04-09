const express = require("express");
const router = express.Router();

const crypto = require("crypto");

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

// frontend posting for faster response
router.get("/callback", async (req, res) => {
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

const paystackSecret = process.env.PAYSTACK_SECRET;

router.post("/callback", async (req, res) => {
	console.log("calling callback");
	//validate event
	const hash = crypto
		.createHmac("sha512", paystackSecret)
		.update(JSON.stringify(req.body))
		.digest("hex");
	if (hash == req.headers["x-paystack-signature"]) {
		// Do something with event
		console.log("made it");
		switch (req.body.event) {
			case "charge.success":
				console.log("charge successful");
				const data = req.body.data;

				const isTransaction = Transaction.findOne({
					reference: data.reference,
				});
				if (isTransaction) return;

				const metadata = data.metadata;
				const store = await Store.findById(metadata.store_id);
				const pricing = await Pricing.findById(metadata.plan);
				if (!store.active) store.activated = true;
				if (metadata.subPlan) {
					const subData = pricing.content[0].subData.find(
						(item) => item.id === metadata.subPlan
					);

					store.clientLimit += subData.amount;
					store.plan = "basic";
					await store.save();

					// log transaction
					const transaction = new Transaction({
						reference: data.reference,
						amount: data.amount / 100,
						paidAt: data.paid_at,
						userId: metadata.user_id,
						storeId: metadata.store_id,
						plan: metadata.plan,
						subPlan: metadata.subPlan,
						referrer: metadata.referrer,
					});
					console.log(transaction);
					try {
						transaction.save();
					} catch (err) {
						console.log(err);
					}

					return res.json({ status: "successful" }).status(200);
				}
				break;

			default:
				break;
		}
	}
	console.log("failed");
	return res.send("failed");
});

module.exports = router;
