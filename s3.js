const aws = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const region = "us-east-2";
const bucketName = "algrora-image-storage";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_TOKEN;

const s3 = new aws.S3({
	region,
	accessKeyId,
	secretAccessKey,
	signatureVersion: "v4",
});

const generateFilename = (filename, filetype) => {
	const type = filetype.split("/")[1];
	const date = new Date().toUTCString();
	const randomString = Math.random().toString(36).substring(2, 7);
	const cleanFileName = filename
		.toLowerCase()
		.replace(/[---]/g, "_")
		.replace(/[0-9]/g, "")
		.substr(0, 20)
		.split(".")[0]
		.concat(`.${type}`);
	const newFilename = `images/${date}~${randomString}~${cleanFileName}`;
	return newFilename;
};

const s3Sign = async (filename, fileType) => {
	const params = {
		Bucket: bucketName,
		Key: generateFilename(filename, fileType),
		ContentType: fileType,
		Expires: 60 * 5,
	};

	const uploadURL = await s3.getSignedUrlPromise("putObject", params);
	return uploadURL;
};

const s3Delete = async (filename) => {
	const params = {
		Bucket: bucketName,
		Key: filename,
	};
	s3.deleteObject(params, (err, data) => {
		if (err) return console.log("err", err);
		console.log("data", data);
	});
};

// s3Delete("2022-01-01~shny9~photo__aacbe.jpeg");
module.exports = {
	s3Sign,
	s3Delete,
};
