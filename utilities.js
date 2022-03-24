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

module.exports.getTime = getTime;
module.exports.generateErrorsMessage = generateErrorsMessage;
