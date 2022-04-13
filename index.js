const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

const User = require("./schema/User");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const bodyParser = require("body-parser");

const nodemailer = require("nodemailer");

// RESTful routes
const paystack = require("./routes/paystackRoute");

dotenv.config();

const secret = process.env.SECRET_KEY;
const email_secret = process.env.EMAIL_SECRET;

const main = async () => {
	const app = express();
	app.use(cors({ origin: "*" }));
	app.use(bodyParser.json());

	// email initialization
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.GMAIL_ADDRESS,
			pass: process.env.GMAIL_PASSWORD,
		},
	});

	// mongoose

	await mongoose.connect(
		process.env.MONGODB_URI ||
			// "mongodb+srv://altech:Altech1234.@algrora-store.t1nhy.mongodb.net/algrora-store?retryWrites=true&w=majority",
			"mongodb://localhost:27017/algroraDB",
		{
			useNewUrlParser: true,
		}
	);
	console.log("mongodb connected");

	const schema = makeExecutableSchema({
		typeDefs,
		resolvers,
	});

	const authorization = async (req) => {
		const bearer = req.headers.authorization || "";
		if (!bearer) return req.next();
		const token = bearer.split(" ")[1];
		try {
			const user = await jwt.verify(token, secret);
			req.user = user;
		} catch (err) {
			console.log(err);
		}
		req.next();
	};

	app.use(authorization);

	const apolloServer = new ApolloServer({
		schema: schema,
		context: ({ req }) => {
			return { secret, userData: req.user, email_secret, transporter };
		},
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app });

	app.use("/paystack", paystack);

	app.get(
		"https://algrorashop.herokuapp.com/confirmation/:emailToken",
		async (req, res) => {
			const emailToken = req.params.emailToken;
			try {
				const { user } = await jwt.verify(emailToken, email_secret);
				const userData = await User.findById(user);
				userData.activated = true;
				userData.save();
				res.redirect("https://algrorashop.herokuapp.com/Success");
			} catch (err) {
				console.log(err);
				res.json("activation failed").status(401);
				// res.redirect("https://algrorashop.herokuapp.com//error");
			}
		}
	);

	if (process.env.NODE_ENV === "production") {
		app.use("/", express.static(path.join(__dirname, "/client/build")));
		app.get("*", (req, res) => {
			res.sendFile(path.join(__dirname, "client", "build", "index.html"));
		});
	}

	const PORT = process.env.PORT || 5000;
	app.listen(PORT);
};

main();
