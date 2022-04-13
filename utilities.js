const getTime = () => {
	const now = new Date().toUTCString();
	return now;
};

const generateErrorsMessage = (err) => {
	const base = err.errors;
	const keys = Object.keys(base);
	const message = base[keys[0]].properties.message;
	return `${keys[0]} ${message}`;
};

const paginateResults = async (model, page, limit) => {
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	const results = {};

	if (endIndex < (await model.countDocuments())) {
		results.isNext = true;
	} else {
		results.isNext = false;
	}

	try {
		results.results = await model.find().limit(limit).skip(startIndex);
		return results;
	} catch (err) {
		console.log(err);
	}
};

module.exports.getTime = getTime;
module.exports.generateErrorsMessage = generateErrorsMessage;
module.exports.paginateResults = paginateResults;
