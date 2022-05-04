const Order = require("../schema/Order");
const { paginateResults } = require("../utilities");

const getAdminOrders = async (_, { page }) => {
	const result = await paginateResults(Order, page, 20);
	console.log(result);
	return { isNext: result.isNext, orders: result.results };
};

module.exports = getAdminOrders;
