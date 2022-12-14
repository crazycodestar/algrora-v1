import dateFormat from "dateformat";
import { formatDistance } from "date-fns";

export const formatTime = (currentTime) => {
	if (!currentTime) return null;
	const raw = new Date(currentTime);
	console.log("raw");
	console.log(raw);
	const time = raw.getHours() + ":" + raw.getMinutes();

	const rawTime = time.split(":");
	if (parseInt(rawTime[1]) < 10) {
		rawTime[1] = "0" + rawTime[1];
	}
	if (rawTime[0] <= 12) return `${rawTime[0]}:${rawTime[1]} AM`;
	const result = `${parseInt(rawTime[0]) - 12}:${rawTime[1]} PM`;
	return result;
};

export const getTime = () => {
	const now = new Date().toUTCString();
	return now;
};

export const relativeDate = (initialDate) => {
	const now = Date.now();
	const starting = new Date(+initialDate);

	return formatDistance(starting, now, { addSuffix: true });
};

export const generateFilename = (filename, filetype) => {
	const type = filetype.split("/")[1];
	const date = dateFormat(Date.now(), "UTC:yyyy-mm-dd");
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

export const uploadImage = async (signS3, fileData) => {
	try {
		await fetch(signS3, {
			method: "PUT",
			headers: {
				"Content-Type": "multipart/form=data",
			},
			body: fileData,
		});
	} catch (err) {
		throw err;
	}
};
