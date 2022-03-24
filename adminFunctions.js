const mongoose = require("mongoose");
const Pricing = require("./schema/Pricing");
const Category = require("./schema/Category");

const pricing1 = new Pricing({
	plan: "basic",
	description: `start with a completely free plan to test our services only pay for what you use from our list of affordable deals`,
	content: [
		{
			info: "pay as you go",
			status: 1,
			subData: [
				{
					key: "5 clients",
					value: 600,
				},
				{
					key: "10 clients",
					value: 1000,
				},
				{
					key: "20 clients",
					value: 2000,
				},
			],
		},
		{
			info: "limited number of products",
			status: 0,
		},
		{
			info: "no product variants",
			status: -1,
		},
	],
});

const pricing2 = new Pricing({
	plan: "premium",
	description: `this is our premium store where we provice you with high quality trading experience at an affordable pricing`,
	pricing: 8000,
	content: [
		{
			info: "unlimited number of clients",
			status: 1,
		},
		{
			info: "unlimited number of products",
			status: 1,
		},
		{
			info: "unlimited number of product variants",
			status: 1,
		},
	],
});

const main = async () => {
	// mongoose
	await mongoose.connect(
		process.env.MONGODB_URI || "mongodb://localhost:27017/algroraDB",
		{
			useNewUrlParser: true,
		}
	);

	// body and sking care
	// comsumer electronics
	// clothing
	// sporting goods

	// await Category.insertMany([
	// 	{
	// 		name: "footwear",
	// 		imageUri:
	// 			"https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
	// 	},
	// 	{
	// 		name: "foods",
	// 		imageUri:
	// 			"https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80",
	// 	},
	// 	{
	// 		name: "jewellery",
	// 		imageUri:
	// 			"https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=408&q=80",
	// 	},
	// 	{
	// 		name: "books",
	// 		imageUri:
	// 			"https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
	// 	},
	// 	{
	// 		name: "fashion accessories",
	// 		imageUri:
	// 			"https://images.unsplash.com/3/www.madebyvadim.com.jpg?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1182&q=80",
	// 	},
	// 	{
	// 		name: "home decor items",
	// 		imageUri:
	// 			"https://images.unsplash.com/photo-1513135724701-30343e546328?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=458&q=80",
	// 	},
	// 	{
	// 		name: "appliances and utencils",
	// 		imageUri:
	// 			"https://images.unsplash.com/photo-1594409060643-5643ef18a236?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
	// 	},
	// 	{
	// 		name: "toys and games",
	// 		imageUri:
	// 			"https://images.unsplash.com/photo-1632501641765-e568d28b0015?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
	// 	},
	// 	{
	// 		name: "provisions",
	// 		imageUri:
	// 			"https://images.unsplash.com/photo-1607977027972-e2aae2b5b1e0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80",
	// 	},
	// 	{
	// 		name: "computer hardware",
	// 		imageUri:
	// 			"https://images.unsplash.com/photo-1555617778-02518510b9fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
	// 	},
	// ]);

	// const uploading = await Pricing.insertMany([pricing1, pricing2]);
	return;
};

main();
