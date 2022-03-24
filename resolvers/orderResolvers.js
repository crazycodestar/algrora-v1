const Product = require("../schema/Product");
const User = require("../schema/User");
const Store = require("../schema/Store");
const Order = require("../schema/Order");
const { getTime, generateErrorsMessage } = require("../utilities");
const crypto = require("crypto");

// queries
module.exports.isOrder = async (_, __, { userData }) => {
	const user = await User.findById(userData.id);
	if (!user) return { status: "failed" };
	// console.log(user);

	return {
		status: 1,
		message: JSON.stringify([user.unReadOrder, user.unReadInbox]),
	};
};

module.exports.getOrders = async (_, { type }, { userData }) => {
	// authorization
	const user = await User.findById(userData.id);
	if (!user) return { status: "failed" };
	// user return
	if (type == "USER") {
		const userOrders = await Order.find({ user: userData.id });
		return { status: "success", orders: userOrders };
	}
	// store return
	if (!user.store) return { status: "failed" };
	const orders = await Order.find({ store: user.store });
	const activatedOrders = orders.filter((order) => order.activated);
	const unPaid = 0;
	// use avaliable clients to activate new orders
	for (order of orders) {
		const toActivate = activatedOrders.find((item) => item.key === order.key);
		if (toActivate) {
			activatedOrders.push();
			continue;
		}
		if (user.clientLimit > 0) {
			user.clientLimit -= 1;
			activatedOrders.push(order);
			continue;
		}

		unPaid += 1;
	}
	return { status: "success", orders, unPaid };
};

// mutations

module.exports.placeOrder = async (_, { orders }, { userData }) => {
	// console.log("placing order");
	// console.log(preOrdersList);
	const user = await User.findById(userData.id);
	if (!user) return { status: "failed" };

	const orderKey = crypto.randomBytes(8).toString("hex");
	const orderList = [];
	const activated = false;

	if (user.clientLimit > 0) {
		user.clientLimit--;
		activated = true;
		user.save();
	}

	for (item of orders) {
		const { productId, storeId, quantity } = item;
		const product = await Product.findById(productId);
		const store = await Store.findById(storeId);

		const newOrder = new Order({
			user: user.id,
			product: product.id,
			store: store.id,
			orderKey,
			quantity,
			activated,
			uploadTime: getTime(),
			updatedTime: getTime(),
			lastActive: "USER",
			read: false,
		});

		// update store user
		const storeUser = await User.findOne({ store: store.id });
		storeUser.unReadInbox++;
		storeUser.save();

		orderList.push(newOrder);
	}
	try {
		await Order.insertMany(orderList);
		return { status: "success" };
	} catch (err) {
		const errorMessage = generateErrorsMessage(err);
		return {
			status: "failed",
			message: errorMessage,
		};
	}
};

const sendNotification = async (orderData, type) => {
	if (orderData.lastActive !== type || orderData.read) {
		if (type == "USER") {
			const storeUser = await User.findOne({ store: orderData.store });
			storeUser.unReadInbox++;
			storeUser.save();
		} else {
			const orderUser = await User.findById(orderData.user);
			orderUser.unReadOrder++;
			orderUser.save();
		}
	}
	orderData.read = false;
	if (type == "USER") {
		orderData.lastActive = "USER";
	} else {
		orderData.lastActive = "STORE";
	}

	orderData.updatedTime = getTime();
};

module.exports.updateOrder = async (
	_,
	{ orderId, order, type },
	{ userData }
) => {
	const user = await User.findById(userData.id);
	if (!user) return { status: "failed", message: "unauthorized user" };
	let orderData = await Order.findById(orderId);

	// update order
	for (const key in order) {
		if (order[key]) orderData[key] = order[key];
	}
	// send notification
	sendNotification(orderData, type);
	try {
		// save order
		await orderData.save();

		return { status: "success", orders: [orderData] };
	} catch (err) {
		const errorMessage = generateErrorsMessage(err);
		return {
			status: "failed",
			message: errorMessage,
		};
	}
};

module.exports.markRead = async (_, { type, ids }, { userData }) => {
	const user = await User.findById(userData.id);
	if (!user) return { status: "failed", message: "unauthorized uers" };
	let errorMessage = "";
	for (const id of ids) {
		const order = await Order.findById(id);
		if (order.lastActive !== type) {
			order.read = true;
		}
		// if statement checks who receives the notification
		if (userData.id === Order.user) {
			if (user.unReadOrder > 0) user.unReadOrder--;
			await user.save();
		} else {
			if (user.unReadInbox > 0) user.unReadInbox--;
			await user.save();
		}

		try {
			await order.save();
		} catch (err) {
			const message = generateErrorsMessage(err);
			errorMessage += message; // don't actually know if it works
		}
	}
	if (errorMessage) return { status: "failed", message: errorMessage };
	return { status: "success" };
};

module.exports.cancelOrder = async (_, { id, type }, { userData }) => {
	const user = await User.findById(userData.id);
	if (!user) return { status: "failed", message: "unauthorized user" };
	const order = await Order.findById(id);
	if (!order) return { status: "failed", message: "invalid order" };
	// send notification
	sendNotification(order, type);
	order.status = "CANCEL";
	// console.log("here", order);
	try {
		await order.save();
		return { status: "success", orders: [order] };
	} catch (err) {
		const errorMessage = generateErrorsMessage(err);
		return {
			status: "failed",
			message: errorMessage,
		};
	}
};
