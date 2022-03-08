const express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.send("hello world");
});

port = process.env.PORT || 8080;
app.listen(port);
