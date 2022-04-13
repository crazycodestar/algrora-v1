const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Category = require("../schema/Category");

const User = require("../schema/User");

const { generateErrorsMessage } = require("../utilities");

module.exports.login = async (parent, args, { secret }) => {
	let user;
	user = await User.findOne({ username: args.username.toLowerCase() });
	if (!user) {
		user = await User.findOne({ emailAddress: args.username.toLowerCase() });
	}
	if (!user)
		return {
			status: "failed",
			message: "user dosen't exist",
		};
	if (!user.activated)
		return {
			status: "unactivated",
			message: "account isn't yet activated",
			user,
		};
	if (!user)
		return {
			status: "failed",
			message: "invalid username or password",
		};
	const isValid = await bcrypt.compare(args.password, user.password);
	if (!isValid)
		return {
			status: "failed",
			message: "incorrect username or password",
		};

	const token = jwt.sign(
		{ id: user.id, username: user.username, storeId: user.store },
		secret
	);

	return {
		status: "success",
		message: `${token}`,
		user,
		isInterest: user.interests.length ? true : false,
	};
};

module.exports.addUser = async (_, args, { secret }) => {
	const password = await bcrypt.hash(args.password, 12);
	const user = new User({
		username: args.username.toLowerCase(),
		password: password,
		emailAddress: args.emailAddress.toLowerCase(),
	});
	try {
		const userData = await user.save();
		const token = jwt.sign(
			{
				id: userData.id,
				username: userData.username,
				storeId: userData.store,
			},
			secret
		);
		return {
			status: "success",
			message: `${user.id}`,
			// message: `${token}`,
			// user: userData,
		};
	} catch (err) {
		if (err.code == 11000)
			return {
				status: "failed",
				message: "user already exists",
			};
		const errorMessage = generateErrorsMessage(err);
		return {
			status: "failed",
			message: errorMessage,
		};
	}
};

module.exports.register = async (
	_,
	{ email, id },
	{ transporter, email_secret }
) => {
	const user = await User.findById(id);

	if (user.activated) {
		return { status: "activated", message: "account already activated" };
	}

	if (email !== user.emailAddress) {
		try {
			user.emailAddress = email;
			user.save();
		} catch (err) {
			if (err.code == 11000)
				return {
					status: "failed",
					message: "user already exists",
				};
			const errorMessage = generateErrorsMessage(err);
			return {
				status: "failed",
				message: errorMessage,
			};
		}
	}
	if (!user) return "user unfound";
	const emailToken = await jwt.sign({ user: user.id }, email_secret, {
		expiresIn: 1000,
	});
	const url = `https://algrorashop.herokuapp.com/confirmation/${emailToken}`;
	transporter.sendMail(
		{
			to: email,
			subject: "email confirmation",
			html: `email confirmation here\n <a href="${url}">${url}</a>`,
		},
		(err, info) => {
			if (err) {
				return {
					status: "failed",
				};
			}
			return { status: "success" };
		}
	);
	return { status: "success" };
};

module.exports.addInterests = async (_, { interests }, { userData }) => {
	const user = await User.findById(userData.id);
	if (!user) return "failed";

	const categories = await Category.find({});

	interests.forEach((interest) => {
		user.interests.push(
			categories.find((category) => category.id === interest)
		);
	});
	try {
		user.save();
		return "success";
	} catch (err) {
		console.log(err);
	}
};

module.exports.updateUser = async (_, { data }, { userData }) => {
	if (!userData.id) return { status: "failed", message: "unauthorized access" };
	const user = await User.findById(userData.id);
	if (!user) return { status: "failed", message: "user does not exist" };

	if (data.imageUri) {
		const imageUri = data.imageUri;
		const imageUriList = imageUri.split("/");
		const filename = `${imageUriList.at(-2)}/${imageUriList.at(-1)}`;
		await s3Delete(filename);
	}

	for (key in data) {
		user[key] = data[key];
	}

	try {
		await user.save();
		return {
			status: "success",
		};
	} catch (err) {
		if (err.code == 11000)
			return {
				status: "failed",
				message: "user already exists",
			};
		const errorMessage = generateErrorsMessage(err);
		return {
			status: "failed",
			message: errorMessage,
		};
	}
};
