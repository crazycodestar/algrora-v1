const Product = require("./schema/Product");
const User = require("./schema/User");
const Store = require("./schema/Store");
const Category = require("./schema/Category");
const Comment = require("./schema/Comment");
const Order = require("./schema/Order");

const resolvers = {
	Product: {
		store: async (parent) => {
			return await Store.findById(parent.store);
		},
		comments: async (parent) => {
			const product = await parent.populate("comments");
			return product.comments;
		},
	},
	Store: {
		products: async (parent) => {
			const store = await parent.populate("products");
			// console.log(product);
			return store.products;
		},
	},
	Comment: {
		user: async (parent) => {
			const { user } = await parent.populate("user");
			return user;
		},
	},
	Order: {
		user: async (parent) => {
			const { user } = await parent.populate("user");
			return user;
		},
		product: async (parent) => {
			const { product } = await parent.populate("product");
			if (!product) return {};
			return product;
		},
		store: async (parent) => {
			const { store } = await parent.populate("store");
			return store;
		},
	},
	Query: {
		hello: () => "graphql connected",
		search: async (_, { search }) => {
			const escapeRegex = (text) => {
				return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			};
			const regex = new RegExp(escapeRegex(search), "gi");
			const results = Product.find({ name: regex });
			return results;
		},
		getProducts: async () => {
			// console.log("getting products");
			return await Product.find({});
		},
		getProduct: async (_, { id }) => {
			return await Product.findById(id);
		},
		user: async (_, __, { userData }) => {
			// console.log("getting user");
			return await User.findById(userData.id);
		},
		getStore: async (_, { id }) => {
			// dosen't function properly
			// console.log("getting store");
			const storeData = await Store.findById(id);
			if (!storeData)
				return {
					status: "failed",
					message: "store not avaliable",
				};
			return {
				status: "success",
				store: storeData,
			};
		},
		getCategories: async () => {
			return await Category.find({});
		},
		getOrders: async (_, { type }, { userData }) => {
			// console.log("type", type);
			if (type == "USER") return await Order.find({ user: userData.id });
			return await Order.find({ store: userData.storeId });
		},
	},
};

module.exports = resolvers;
