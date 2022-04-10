const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { s3Sign, s3Delete } = require("./s3");

const Product = require("./schema/Product");
const User = require("./schema/User");
const Store = require("./schema/Store");
const Category = require("./schema/Category");
const Comment = require("./schema/Comment");
const Order = require("./schema/Order");
const Pricing = require("./schema/Pricing");

const { getTime } = require("./utilities");
const {
	addStore,
	getPricing,
	getTransactions,
	initStore,
} = require("./resolvers/storeResolvers");
const {
	isOrder,
	placeOrder,
	markRead,
	getOrders,
	updateOrder,
	cancelOrder,
} = require("./resolvers/orderResolvers");
const {
	addUser,
	updateUser,
	login,
	register,
	addInterests,
} = require("./resolvers/userResolver");

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
	Transaction: {
		plan: async (parent) => {
			return await Pricing.findById(parent.plan);
		},
		subPlan: async (parent) => {
			const plan = await Pricing.findById(parent.plan);
			const lekan = plan.content[0].subData.find(
				(item) => item.id === parent.subPlan.toString()
			);
			return lekan;
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
			console.log("getting products");
			const products = await Product.find({});
			console.log(products);
			return products;
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
		getOrders,
		isOrder,
		getPricing,
		getTransactions,
	},
	Mutation: {
		addUser: addUser,
		register: register,
		addInterests,
		updateUser: updateUser,
		login: login,
		signS3: async (parent, { filename, fileType }) => {
			const uploadUrl = await s3Sign(filename, fileType);
			return uploadUrl;
		},
		addStore: addStore,
		initStore,
		updateStore: async (_, { id, store }, { userData }) => {
			// console.log("updating store");
			const user = User.findById(userData.id);
			if (!user) return { status: "failed" };
			const storeData = await Store.findById(id);
			if (store.imageUri) {
				const imageUri = storeData.imageUri;
				const imageUriList = imageUri.split("/");
				const filename = `${imageUriList.at(-2)}/${imageUriList.at(-1)}`;
				await s3Delete(filename);
			}
			for (p in store) {
				if (store[p]) {
					storeData[p] = store[p];
				}
			}
			try {
				await storeData.save();
				return { status: "success" };
			} catch (err) {
				const base = err.errors;
				const keys = Object.keys(base);
				const message = base[keys[0]].properties.message;
				return {
					status: "failed",
					message: `${keys[0]} ${message}`,
				};
			}
		},
		addProduct: async (_, args, { userData }) => {
			// console.log("adding Product");
			console.log(args);
			const { imageUri, name, description, price, tags } = args.product;
			const product = new Product({
				name,
				imageUri,
				description,
				price,
				tags,
			});
			try {
				const user = await User.findById(userData.id);
				const store = await Store.findById(user.store);
				// change the product limiter here
				product.store = store.id;
				if (store.products.length >= 5) {
					return {
						status: "failed",
						message: "you are only permitted to 5 products in your store",
					};
				}
				const productData = await product.save();
				store.products.push(productData.id);
				// get users store
				await store.save();
				return {
					status: "success",
					message: "product successfully added",
					product: productData,
				};
			} catch (err) {
				const base = err.errors;
				const keys = Object.keys(base);
				const message = base[keys[0]].properties.message;
				return {
					status: "failed",
					message: `${keys[0]} ${message}`,
				};
			}
		},
		updateProduct: async (_, { id, product }, { userData }) => {
			// console.log("updating product");
			const user = User.findById(userData.id);
			if (!user) return { status: "failed" };
			const productData = await Product.findById(id);
			if (product.imageUri) {
				const imageUri = productData.imageUri;
				const imageUriList = imageUri.split("/");
				const filename = `${imageUriList.at(-2)}/${imageUriList.at(-1)}`;
				await s3Delete(filename);
			}
			for (p in product) {
				if (product[p]) {
					productData[p] = product[p];
				}
			}
			try {
				await productData.save();
				return { status: "success" };
			} catch (err) {
				const base = err.errors;
				const keys = Object.keys(base);
				const message = base[keys[0]].properties.message;
				return {
					status: "failed",
					message: `${keys[0]} ${message}`,
				};
			}
		},
		deleteProduct: async (_, { id }, { userData }) => {
			const user = await User.findById(userData.id);
			if (!user) return { status: "failed", message: "unauthorized" };

			const product = await Product.findById(id);
			if (!product)
				return { status: "failed", message: "product doesn't exist" };
			const imageUri = product.imageUri;
			const imageUriList = imageUri.split("/");
			const filename = `${imageUriList.at(-2)}/${imageUriList.at(-1)}`;
			await s3Delete(filename);
			const store = await Store.findById(product.store);
			// console.log("product _id", product.id);
			// clean up store
			const products = [];
			for (p of store.products) {
				// const pData = await Product.findOne({ _id: p });
				const pData = await Product.findById(p);
				if (pData.id !== product.id) products.push(pData.id);
			}
			store.products = products;
			// clean up comments
			for (comment of product.comments) {
				Comment.findOneAndDelete({ id: comment });
			}
			try {
				await store.save();
				// clean up orders
				await Order.deleteMany({ product: product.id });
				await Product.findByIdAndDelete(product.id);
				return { status: "success" };
			} catch (err) {
				return { status: "failed", message: err };
			}
		},
		addComment: async (_, { id, comment }, { userData }) => {
			const user = await User.findById(userData.id);
			const commentData = new Comment({
				user: user.id,
				uploadTime: getTime(),
				comment,
			});
			try {
				const returnData = await commentData.save();
				const product = await Product.findById(id);
				product.comments.push(returnData.id);
				await product.save();
				return {
					status: "success",
					message: "successfully added comment",
					comment: returnData,
				};
			} catch (err) {
				const base = err.errors;
				const keys = Object.keys(base);
				const message = base[keys[0]].properties.message;
				return {
					status: "failed",
					message: `${keys[0]} ${message}`,
				};
			}
		},
		placeOrder: placeOrder,
		updateOrder: updateOrder,
		cancelOrder: cancelOrder,
		markRead: markRead,
	},
};

module.exports = resolvers;
