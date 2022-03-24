const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const MySecretKey = `Bearer ${process.env.PAYSTACK_SECRET}`;

const initializePayment = async (data) => {
	try {
		const response = await axios({
			url: "https://api.paystack.co/transaction/initialize",
			method: "post",
			headers: {
				authorization: MySecretKey,
				"content-type": "application/json",
				"cache-control": "no-cache",
			},
			data,
		});

		return response.data;
	} catch (err) {
		console.log(err);
	}
};
const verifyPayment = async (ref) => {
	try {
		const response = await axios({
			url: "https://api.paystack.co/transaction/verify/" + ref,
			method: "get",
			headers: {
				authorization: MySecretKey,
				"content-type": "application/json",
				"cache-control": "no-cache",
			},
		});
		// console.log("response.data");
		// console.log(response.data);
		if (response.data.status) return response.data.data.metadata;
	} catch (err) {
		console.log(err);
	}
};

module.exports = { initializePayment, verifyPayment };
